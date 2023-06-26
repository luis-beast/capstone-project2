import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import "./forumList.css";

const ForumList = () => {
  const navigate = useNavigate();
  const [forum, setForum] = useState([]);
  const [forumId, setForumId] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    getForum();
  }, []);

  const getForum = () => {
    fetch("http://localhost:8080/forum")
      .then((res) => res.json())
      .then((data) => {
        setForum(data);
      });
  };

  const getForumId = (id) => {
    fetch(`http://localhost:8080/forum/${id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        console.log("forumId", data);
        setForumId(data);
      });
  };

  const handleClick = (id) => {
    //intent is to have this route each clicked entry to it's corresponding
    // forum page
    navigate(`/forum/${id}`);
  };

  // click on a forum that would take you to the page for that forum let a user
  // comment on the forum (/forum/:id) | useNavigate
  return (
    <div className="thread-containerr">
      <div className="threads">
        {forum.length > 0 &&
          forum.map((line, index) => {
            return (
              <div
                className="forum"
                onClick={() => handleClick(line.id)}
                key={index}
              >
                {JSON.stringify(line.name)}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ForumList;
