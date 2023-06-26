import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../../components";
import "./forumPage.css";
import ForumComment from "../../components/ForumComment/ForumComment";

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
  const [forumName, setForumName] = useState("");
  const [errors, setErrors] = useState({
    body: "",
  });
  const [shown, setShown] = useState(-1);

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
    setReplyInput({ ...replyInput, body: e.target.value });
    console.log("handleReplyChange: ", e.target.value);
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
  // options
  // .filter to get all the null replies_to (top level comments)
  // .

  // nested forEach to go through comments
  //// array of object. Each comment should be an object that has a nested array of replies. (array of objects?)
  //// attach replies to the comments object
  //// useEffect with a fetch to get all the replies.
  ////// 1. go throught the commentsa in the .then (replies.forEach)
  ////// 2. compare replies comment id to the id of this array and attach them (.filter)
  ////// 3. push to the array

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
      <div className="Thread_container">
        <div className="Threads">
          <h1>{forumName}</h1>
          {forumComment?.length &&
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
