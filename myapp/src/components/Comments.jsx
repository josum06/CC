import axios from "axios";
import { format, parseISO } from "date-fns";
import { useState } from "react";

function Comments({ postId }) {
  // This component is responsible for displaying comments on a post
  const [viewComments, setViewComments] = useState(false);
  const [comments, setComments] = useState([]);
  const handleClick = async () => {
    setViewComments(!viewComments);
    const response = await axios.get(
      `http://localhost:3000/api/post/get-comments/${postId}`
    );
    const comments = response.data.comments;
    setComments(comments);
  };
  return (
    <div>
      <button
        onClick={() => handleClick()}
        className="text-blue-500 hover:underline"
      >
        View Comments
      </button>
      {viewComments && (
        <ul className="list-disc pl-4 mt-2">
          {comments.map((comment) => {
            return (
              <li className="m-2 bg-yellow-200" key={comment._id}>
                <div>User: {comment?.userId?.fullName}</div>
                <div>
                  Created At:{" "}
                  {comment.createdAt
                    ? format(
                        parseISO(comment.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )
                    : "N/A"}
                </div>
                <div>{comment.text}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Comments;
