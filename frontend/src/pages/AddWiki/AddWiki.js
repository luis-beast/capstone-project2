import { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import "./AddWiki.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UserContext from "../../userContext";
import { TagEditor } from "../../components";

const AddWiki = () => {
  const [userData, setUserData] = useContext(UserContext);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    body: "",
  });
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!title) {
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
      body: JSON.stringify({
        body: body,
        title: title,
        user_id: userData.id,
        tags: tags,
      }),
    };
    fetch("http://localhost:8080/pages", init)
      .then((res) => {
        console.log("response status: ", res.status);
        if (!res.ok) {
          throw new Error("HTTP status: ", res.satus);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Success:", data);
        navigate(`/page/${data[0]}`);
      })
      .catch((err) => {
        console.log(err);
      });
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <ReactQuill
            className="wiki-input-container"
            value={body}
            onChange={(value) => {
              setBody(value);
            }}
            placeholder="Text Body"
            theme="snow"
          />
          <TagEditor currentTags={tags} setCurrentTags={setTags} />
          <div className="wiki-buttons-container">
            <button onClick={saveToDb}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWiki;
