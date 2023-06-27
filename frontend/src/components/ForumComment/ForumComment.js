import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./ForumComment.css";
import UserContext from "../../userContext";

const ForumComment = ({ comment, offset, shown, setShown }) => {
  const [replyInput, setReplyInput] = useState("");
  const [userData, setUserData] = useContext(UserContext);

  const handleReplyChange = (e) => {
    setReplyInput(e.target.value);
  };

  const replyToComment = (commentId) => {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: replyInput,
        replies_to: commentId,
        user_id: userData.id,
      }),
    };
    fetch(`http://localhost:8080/forum/${comment.forum_id}/comments`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log("Successfully responded to comment: ", data);
      })
      .finally(() => {
        setReplyInput("");
        setShown(-1);
        window.location.reload(false);
      });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: "[DELETED]", user_id: null }),
    };
    fetch(`http://localhost:8080/forum/comment/${comment.id}`, init)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Could not delete comment with id ${comment.id}`);
        }
      })
      .then((data) => {
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    comment && (
      <div className={`forum-comment comment-level-${offset}`}>
        <div className="comment-body">
          <h5>{comment.email}</h5>
          <p>{comment.body}</p>
        </div>
        {userData.id && (
          <button onClick={() => setShown(comment.id)}>Reply to Comment</button>
        )}
        {(userData.id === comment.user_id || userData.is_admin) && (
          <button onClick={handleDelete}>Delete Comment</button>
        )}
        {userData.id && shown == comment.id && (
          <>
            <textarea
              className="reply-comment"
              placeholder="Enter your reply here..."
              name={`reply-${comment.id}`}
              value={replyInput}
              onChange={(e) => handleReplyChange(e)}
            />
            <button onClick={() => replyToComment(comment.id)}>
              Submit Comment
            </button>
          </>
        )}
        {comment.replyArray?.length >= 0 &&
          comment.replyArray.map((reply, index) => {
            return (
              <ForumComment
                key={index}
                comment={reply}
                offset={offset + 1}
                shown={shown}
                setShown={setShown}
              />
            );
          })}
      </div>
    )
  );
};

export default ForumComment;
