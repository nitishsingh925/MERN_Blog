import Post from "./Post";
import { useEffect, useState } from "react";
import { POST_URL } from "../config";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(POST_URL)
      .then((response) => response.json())
      .then((posts) => setPosts(posts));
  }, []);

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </>
  );
};

export default Home;
