import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../../components";
import moment from "moment";
import "./forumList.css";
import { BiSearch } from "react-icons/bi";

const ForumList = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [forum, setForum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forumId, setForumId] = useState([]);
  const [search, setSearch] = useState(
    state?.initialSearch ? state.initialSearch : ""
  );
  const [searchInput, setSearchInput] = useState(
    state?.initialSearch ? state.initialSearch : ""
  );
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

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
    navigate(`/forum/${id}`);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setTerm(e.target.value);
    if (e.target.value === "") {
      setResults([]);
    }
  };

  const searchForTerm = () => {
    let resultsArray = [];
    for (let i = 0; i < forum.length; ++i) {
      if (forum[i].name.toLowerCase().includes(term.toLowerCase())) {
        console.log("found a result!", forum[i].name);
        resultsArray.push(forum[i]);
      }
    }
    setResults(resultsArray);
    if (resultsArray.length === 0) {
      alert("no results were found");
    }
  };

  return (
    <div className="thread-containerr">
      <div className="search-bar">
        <h1>Search forums by title</h1>
        <span>
          <input
            type="text"
            value={term}
            onChange={handleChange}
            placeholder="Search"
          />
          <button className="search" onClick={searchForTerm}>
            <BiSearch /> Search{" "}
          </button>
        </span>
      </div>
      <div className="threads">
        {results.length
          ? results.map((res, index) => (
              <div
                className="forum"
                onClick={() => handleClick(res.id)}
                key={index}
              >
                <h1>{res.name}</h1>
                <p>
                  Last updated @{" "}
                  {moment.utc(res.updated_at).format("DD MMM YYYY hh:mm:ss")}
                </p>
              </div>
            ))
          : forum.length > 0 &&
            forum.map((line, index) => {
              return (
                <div
                  className="forum"
                  onClick={() => handleClick(line.id)}
                  key={index}
                >
                  <h1>{line.name}</h1>
                  <p>
                    Last updated @{" "}
                    {moment.utc(line.updated_at).format("DD MMM YYYY hh:mm:ss")}
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default ForumList;
