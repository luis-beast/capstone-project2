import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components";
import "./forum.css";

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

  // click on a forum that would take you to the page for that forum let a user
  // comment on the forum (/forum/:id) | link or useNavigate

  const handleClick = () => {
    //intent is to have this route each clicked entry to it's corresponding
    // forum page
    alert("object clicked");
  };

  return (
    <div className="thread-containerr">
      <div className="threads">
        {forum.length > 0 &&
          forum.map((line, index) => {
            return (
              <div onClick={handleClick} key={index}>
                {JSON.stringify(line)}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ForumList;
