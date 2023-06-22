import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../../components";
import "./forumPage.css";

const ForumPage = () => {
  const [forumComment, setForumComment] = useState([]);
  const { id } = useParams();
  const [userInput, setUserInput] = useState({
    body: "",
  });
  const [replyInput, setReplyInput] = useState({
    body: "",
    replies_to: "",
  });
  const [errors, setErrors] = useState({
    body: "",
  });

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
    // setUserInput({...userInput.replies_to, [e.target.]})
  };

  const handleReplyChange = (e, commentId) => {
    setReplyInput({ ...replyInput, [commentId]: e.target.value });
  };

  const elementId = (e) => {
    console.log(e.currentTarget.id);
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
      });
    setUserInput({ body: "" });
  };

  const getForumComments = (id) => {
    fetch(`http://localhost:8080/forum/${id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        console.log("forum comments: ", data);
        setForumComment(data);
      });
  };
  //should be refering to the comment id
  const replyToComment = (commentId) => {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: replyInput.body, replies_to: commentId }),
    };
    fetch(`http://localhost:8080/forum/${id}/comments`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log("Successfully responded to comment: ", data);
      });
    setReplyInput({ body: "" });
  };

  useEffect(() => {
    getForumComments(id);
  }, [id]);

  return (
    <div className="Wrapper">
      <div className="Thread_container">
        <div className="Threads">
          {forumComment.map((comment, index) => {
            return (
              <div key={index} className="Comment">
                {/* {JSON.stringify(comment)} */}
                {comment.id}: {comment.body}
                <textarea
                  className="reply-comment"
                  placeholder="Enter your reply here..."
                  name={`reply-${index}`}
                  value={replyInput[index] || ""}
                  onChange={(e) => handleReplyChange(e, index)}
                />
                <button onClick={() => replyToComment(comment.id)}>
                  Reply
                </button>
              </div>
            );
          })}
          <hr />
          {errors.body && <div className="error">{errors.body}</div>}
          <textarea
            className="New_comment"
            placeholder="Enter text here..."
            name="body"
            required
            value={userInput.body}
            onChange={handleChange}
          />
          <button onClick={() => saveToDb(id)}>Comment</button>
          <div className="Thread_comments"></div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
