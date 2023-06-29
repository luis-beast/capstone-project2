import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../../components";
import "./forumPage.css";
import ForumComment from "../../components/ForumComment/ForumComment";
import UserContext from "../../userContext";
import ReactQuill from "react-quill";

const ForumPage = () => {
  const [forumComment, setForumComment] = useState([]);
  const { id } = useParams();
  const [userInput, setUserInput] = useState({
    body: "",
  });
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
        console.log("forum: ", data);
        setForumName(data[0].name);
      });
  };

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
    // setUserInput({...userInput.replies_to, [e.target.]})
  };

  const handleReplyChange = (e, commentId) => {
    setEditorValue(e.target.value);
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!userInput.body) {
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
    console.log("errors: ", errors.body);

    console.log("Id from saveToDb: ", id);
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    };
    fetch(`http://localhost:8080/forum/${id}/comments`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data successfully posted: ", data);
        setUserInput("");
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  const getForumComments = (id) => {
    fetch(`http://localhost:8080/forum/${id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        console.log("forum comments: ", data);
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
    <div className="Wrapper">
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
                <button onClick={() => saveToDb(id)}>Post Comment</button>
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
    </div>
  );
};

export default ForumPage;
