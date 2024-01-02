import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import { POST_URL, SIMPLE_URL } from "../config";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  useEffect(() => {
    fetch(`${POST_URL}/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);
  if (!postInfo) {
    return <div>Loading...</div>;
  }
  return (
    <div className="postPage">
      <div className="title">
        <h1>{postInfo.title}</h1>
      </div>
      <div className="author">
        <p className="info">
          <a href={null} className="author">
            {"👩🏻" + postInfo.author.username + " "}
          </a>
          <time>
            {"🗓️" + new Date(postInfo.createdAt).toLocaleString("en-IN")}
          </time>
        </p>
        {userInfo.id === postInfo.author._id && (
          <div className="edit_row">
            <Link className="edit_btn" to={`/edit/${postInfo._id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit this post
            </Link>
          </div>
        )}
      </div>
      <div className="image">
        <img src={SIMPLE_URL + postInfo.cover} alt="image" />
      </div>
      <div className="texts">
        <p className="summary">{postInfo.summary}</p>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>
    </div>
  );
};

export default PostPage;
