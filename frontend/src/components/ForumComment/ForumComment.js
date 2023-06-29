import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./ForumComment.css";
import UserContext from "../../userContext";
import ReactQuill from "react-quill";
import parse from "html-react-parser";

const ForumComment = ({ comment, offset, shown, setShown }) => {
  const [editorValue, setEditorValue] = useState("");
  const [userData, setUserData] = useContext(UserContext);

  const handleReplyChange = (e) => {
    setEditorValue(e.target.value);
  };

  const replyToComment = (commentId) => {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: editorValue,
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
        setEditorValue("");
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

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code"],
      [{ script: "sub" }, { script: "super" }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],

      ["code-block"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code",
    "script",
    "list",
    "bullet",
    "indent",
    "code-block",
    "link",
  ];

  return (
    comment && (
      <div className={`forum-comment comment-level-${offset}`}>
        <div className="comment-body">
          <div className="comment-header">
            <h5>{comment.email}</h5>
            {comment.is_admin && <h5 className="admin-label">ADMIN</h5>}
          </div>
          <p>{parse(comment.body)}</p>
        </div>
        {userData.id && (
          <button
            onClick={() => setShown(shown === comment.id ? -1 : comment.id)}
          >
            {shown === comment.id ? "Cancel Reply" : "Reply to Comment"}
          </button>
        )}
        {(userData.id === comment.user_id || userData.is_admin) && (
          <button className="danger" onClick={handleDelete}>
            Delete Comment
          </button>
        )}
        {userData.id && shown == comment.id && (
          <div className="reply-text-editor">
            <ReactQuill
              value={editorValue}
              onChange={(value) => {
                setEditorValue(value);
              }}
              modules={modules}
              formats={formats}
              placeholder="Text Body"
              theme="snow"
            />
            <button onClick={() => replyToComment(comment.id)}>
              Submit Comment
            </button>
          </div>
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
