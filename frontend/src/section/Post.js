import { Link } from "react-router-dom";
import { SIMPLE_URL } from "../config";
const Post = (props) => {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${props._id}`}>
          <img src={SIMPLE_URL + props.cover} alt="image" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${props._id}`}>
          <h2>{props.title}</h2>
        </Link>
        <p className="info">
          <a href={null} className="author">
            {props.author.username}
          </a>
          <time>{new Date(props.createdAt).toLocaleString("en-IN")}</time>
        </p>
        <p className="summary">{props.summary}</p>
      </div>
    </div>
  );
};

export default Post;
