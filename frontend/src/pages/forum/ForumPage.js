import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../../components";
import "./forumPage.css";
import ForumComment from "../../components/ForumComment/ForumComment";
import UserContext from "../../userContext";
import ReactQuill from "react-quill";
import moment from "moment";

const ForumPage = () => {
  const [forumComment, setForumComment] = useState([]);
  const { id } = useParams();
  const [showEditor, setShowEditor] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [forumName, setForumName] = useState("");
  const [errors, setErrors] = useState({
    body: "",
  });
  const [shown, setShown] = useState(-1);
  const [userData, setUserData] = useContext(UserContext);

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

  useEffect(() => {
    getForumName(id);
  }, [id]);

  const getForumName = (id) => {
    fetch(`http://localhost:8080/forum/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForumName(data[0].name);
      });
  };

  const handleChange = (e) => {
    setEditorValue(e.target.value);
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!editorValue || editorValue === "<p></p>") {
      formIsValid = false;
      errors["body"] = "Comment cannot be empty";
    }

    setErrors(errors);
    return formIsValid;
  };

  const saveToDb = (id) => {
    if (!handleValidation()) {
      return;
    }

    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userData.id,
        body: editorValue,
        replies_to: null,
      }),
    };
    fetch(`http://localhost:8080/forum/${id}/comments`, init)
      .then((res) => res.json())
      .then((data) => {
        setEditorValue("");
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  const getForumComments = (id) => {
    fetch(`http://localhost:8080/forum/${id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        const condensedData = data
          .filter((comment) => {
            return !comment.replies_to;
          })
          .map((topLevelComment) => {
            return addReplyTree(topLevelComment, data);
          });
        setForumComment(condensedData);
      });
  };

  //Recursive function is needed to get ALL of the comments and replies because each comment is at the head of its own tree of replies.
  const addReplyTree = (comment, allComments) => {
    let allReplies = allComments.filter(
      (potentialReply) => potentialReply.replies_to === comment.id
    );
    let replyTree = allReplies.map((reply) => {
      return addReplyTree(reply, allComments);
    });
    return { ...comment, replyArray: replyTree };
  };

  useEffect(() => {
    getForumComments(id);
  }, [id]);

  return (
    <div className="forum-page">
      <h1>{forumName}</h1>
      {userData.id && (
        <div className="top-level-reply">
          <button
            className={`${showEditor ? "danger" : ""}`}
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? "Cancel Comment" : "Add Comment"}
          </button>
          {showEditor && (
            <div className="comment-editor">
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
              <button
                disabled={!editorValue || editorValue === "<p></p>"}
                onClick={() => saveToDb(id)}
              >
                Post Comment
              </button>
            </div>
          )}
        </div>
      )}
      <div className="threads-container">
        {!!forumComment?.length &&
          forumComment
            .filter((comment) => !comment.replies_to)
            .map((comment, index) => {
              return (
                comment && (
                  <div key={index} className="top-level-comment-box">
                    <ForumComment
                      comment={comment}
                      offset={0}
                      shown={shown}
                      setShown={setShown}
                    />
                  </div>
                )
              );
            })}
        <hr />
        {errors.body && <div className="error">{errors.body}</div>}
      </div>
    </div>
  );
};

export default ForumPage;
