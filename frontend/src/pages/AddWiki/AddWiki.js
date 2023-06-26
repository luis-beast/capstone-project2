import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import "./AddWiki.css";

const AddWiki = () => {
  const [userInput, setUserInput] = useState({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    body: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!userInput.title) {
      formIsValid = false;
      errors["title"] = "You must enter a title!";
    }

    setErrors(errors);
    return formIsValid;
  };

  const saveToDb = () => {
    if (!handleValidation()) {
      return;
    }

    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    };
    console.log(init.body);
    fetch("http://localhost:8080/pages", init)
      .then((res) => res.json())
      .then((data) => {
        console.log("Success:", data);
        navigate(`/page/${data[0].id}`);
      });
    setUserInput("");
  };

  return (
    <div className="Wrapper">
      <div className="Content">
        <div className="wiki-container">
          <div className="wiki-header">
            <h1 className="wiki-header">Enter your new WikiPage here</h1>
          </div>
          <div className="wiki-title-cointainer">
            {errors.title && <div className="error">{errors.title}</div>}
            <input
              className="wiki-input-title"
              type="text"
              name="title"
              placeholder="Enter a title..."
              onChange={handleChange}
            />
          </div>
          <div className="wiki-input-container">
            <textarea
              className="wiki-input"
              placeholder="Enter text here..."
              name="body"
              onChange={handleChange}
            />
          </div>
          <div className="wiki-buttons-container">
            <button onClick={saveToDb}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWiki;
