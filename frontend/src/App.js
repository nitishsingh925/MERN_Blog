import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./section/Layout";
import Home from "./section/Home";
import LoginPage from "./section/LoginPage";
import RegisterPage from "./section/RegisterPage";
import CreatePost from "./section/CreatePost";
import PostPage from "./section/PostPage";
import EditPost from "./section/EditPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/create",
        element: <CreatePost />,
      },
      {
        path: "/post/:id",
        element: <PostPage />,
      },
      {
        path: "/edit/:id",
        element: <EditPost />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
