import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../../components";
import moment from "moment";
import "./forumList.css";

const ForumList = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [forum, setForum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forumId, setForumId] = useState([]);
  const [search, setSearch] = useState(
    state?.initialSearch ? state.initialSearch : ""
  );
  const [searchInput, setSearchInput] = useState(
    state?.initialSearch ? state.initialSearch : ""
  );

  const { id } = useParams();
  useEffect(() => {
    getForum();
  }, []);

  const getForum = () => {
    fetch("http://localhost:8080/forum")
      .then((res) => res.json())
      .then((data) => {
        setForum(data);
        console.log("forum: ", data);
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
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      setSearch("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearch(searchInput);
    setLoading(false);
  };

  //TODO - edit this function to check if a forum matches the search input.
  const matchesSearchInput = (page, searchTerms) => {
    console.log("page: ", page);
    const termArray = searchTerms.split(" ");
    for (let i = 0; i < termArray.length; i++) {
      let term = termArray[i];
      console.log("term: ", term);

      // if (page.name.find((name) => page.name === searchTitle)) {
      //   return false;
      // } else {
      //   if (!page.name.includes(term)) {
      //     return false;
      //   }
      // }
    }
    return true;
  };

  const SearchItem = ({ forumPage }) => {
    const stringBody = forumPage.body.replace(/<\/?[^>]+(>|$)/g, "");

    return (
      <div className="forum" onClick={() => handleClick(forumPage.id)}>
        <h1>{forumPage.name}</h1>
        <p>
          Last updated @{" "}
          {moment.utc(forumPage.updated_at).format("DD MMM YYYY hh:mm:ss")}
        </p>
      </div>
    );
  };

  return (
    <div className="thread-containerr">
      <div className="search-bar">
        <p>Search forums by title</p>
        <span>
          <input
            type="text"
            value={searchInput}
            onChange={handleChange}
            placeholder="Search"
          />
          <button className="search" onClick={handleSearch}>
            Search{" "}
          </button>
        </span>
      </div>
      <div className="threads">
        {forum.length > 0 &&
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
                <>
                  {/* {forum
                    .filter((forumPage) =>
                      matchesSearchInput(forumPage, search)
                    )
                    .map((forumPage, index) => {
                      return;
                    })} */}
                </>
              </div>
            );
            {
              forum
                .filter((forumPage) => matchesSearchInput(forumPage, search))
                .map((forumPage, index) => {
                  return <SearchItem forumPage={forumPage} key={index} />;
                });
            }
          })}
      </div>
    </div>
  );
};

export default ForumList;
