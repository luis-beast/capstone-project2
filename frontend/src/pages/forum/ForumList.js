import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components";
import "./forum.css";

// 2 fetch requests to get the forum and a fetch to get the forum comments
// User has ability to comment on a forum

// click on a forum that would take you to the page for that forum let a user comment on the forum (/forum/:id) | link or useNavigate

const ForumList = () => {
  const [forum, setForum] = useState([]);

  useEffect(() => {
    getForum();
  }, []);

  const getForum = () => {
    fetch("http://localhost:8080/forum")
      .then((res) => res.json())
      .then((data) => {
        console.log("forum", data);
        setForum(data);
      });
  };

  return (
    <div className="Wrapper">
      <Navbar />
      <div className="Thread_container">
        <div className="Threads">
          {JSON.stringify(forum)}
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

export default ForumList;
