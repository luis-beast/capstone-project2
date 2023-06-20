import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components";
import "./forum.css";

const Forum = () => {
  const [userInput, setUserInput] = useState({
    page_id: "",
    name: "",
  });

  const saveToDb = () => {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    };
  };

  const getFromDb = () => {
    fetch("http://localhost:8080/forum")
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const handleChange = (e) => {
    e.preventDefault();
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getFromDb();
  }, []);

  return (
    <div className="Wrapper">
      <Navbar />
      <div className="Thread_container">
        <div className="Threads">
          <div className="Thread_comments">
            <span>sample text</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
