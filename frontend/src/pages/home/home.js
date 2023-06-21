import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import { Search } from "../../components/index";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleClick = (e) => {
    navigate("/search", { state: { initialSearch: searchInput } });
  };

  return (
    <div className="home">
      <h1>WikiForces</h1>
      <img src="/image.png" alt="eagle" />
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search for a wikipage..."
          onChange={handleChange}
          value={searchInput}
        />
        <button onClick={handleClick}>Search</button>
      </div>
      <Link to="/add-wiki">
        <button>Add WikiPage</button>
      </Link>
    </div>
  );
};

export default Home;
