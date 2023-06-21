import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components";
import "./forumPage.css";

//user can comment on the forum (/forum/:id) | link

const ForumPage = () => {
  const [forumComment, setForumComment] = useState([]);

  const saveToDb = (id) => {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forumComment),
    };
    fetch(`http://localhost:8080/forum/${id}/comments`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data successfully posted: ", data);
      });
  };

  const getForumComments = (id) => {
    // Should I be specifying an id as a parameter
    fetch(`http://localhost:8080/forum/${id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        console.log("forum comments: ", data);
        setForumComment({ ...forumComment, data });
      });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setForumComment({ ...forumComment, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    forumComment();
  }, []);

  return (
    <div className="Wrapper">
      <Navbar />
      <div className="Thread_container">
        <div className="Threads">
          {JSON.stringify(forumComment)}
          <textarea
            className="New_comment"
            placeholder="Enter text here..."
            name="body"
            // onChange={}
          />
          <button>Comment</button>
          <div className="Thread_comments">
            <span>sample text</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
