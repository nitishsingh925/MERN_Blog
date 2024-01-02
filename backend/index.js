import express from "express";
import cors from "cors";
import { User } from "./models/User.models.js";
import { Post } from "./models/Post.models.js";
import connectDB from "./connectDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import { PORT, CORS_ORIGIN } from "./config.js";

const app = express();
const uploadMiddleware = multer({ dest: "uploads/" });

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

const salt = bcrypt.genSaltSync(10);
const secret = "mysecret";
// user registration data validation and saving to database  using mongoose model User

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    res.json(
      await User.create({
        username,
        password: bcrypt.hashSync(password, salt),
      })
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// user login data validation and checking with database using mongoose model User

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res.json(info);
  });
});
// user logout and clearing cookie

app.post("/logout", (req, res) => {
  res.clearCookie("token").json("cookie cleared");
});

// create post and saving to database using mongoose model Post

app.post("/post", uploadMiddleware.single("file"), (req, res) => {
  const { originalname, path } = req.file;
  const ext = originalname.split(".").pop();
  const newPath = `${path}.${ext}`;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const { title, summary, content } = req.body;

    const postDoc = new Post({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    postDoc
      .save()
      .then((savedPost) => {
        res.json(savedPost);
      })
      .catch((error) => {
        console.error("Error saving post:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

//    edit

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await Post.updateOne(
      { _id: id, author: info.id },
      {
        $set: {
          title,
          summary,
          content,
          cover: newPath ? newPath : postDoc.cover,
        },
      }
    );

    res.json(postDoc);
  });
});
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
