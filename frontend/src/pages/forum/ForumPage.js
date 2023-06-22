import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../../components";
import "./forumPage.css";

//user can comment on the forum (/forum/:id) | link

const ForumPage = () => {
  const [forumComment, setForumComment] = useState([]);
  const { id } = useParams();
  const [userInput, setUserInput] = useState({
    body: "",
  });

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };
  // add code to prevenet being able to comment if it's empty.
  const saveToDb = (id) => {
    console.log("Id from saveToDb: ", id);
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
        setForumComment(data);
      });
  };

  useEffect(() => {
    getForumComments(id);
  }, [id]);

  return (
    <div className="Wrapper">
      <div className="Thread_container">
        <div className="Threads">
          {JSON.stringify(forumComment)}
          <textarea
            className="New_comment"
            placeholder="Enter text here..."
            name="body"
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
