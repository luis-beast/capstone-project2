import React from "react";
import { useState, useContext } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import { Search } from "../../components/index";
import "./home.css";
import UserContext from "../../userContext";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [userData, setUserData] = useContext(UserContext);
  console.log(userData);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleClick = (e) => {
    navigate("/search", { state: { initialSearch: searchInput } });
  };

  const handleLogout = () => {
    setUserData({});
    window.location.reload(false);
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
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/add-wiki">Add WikiPage</Link>
          <Link to="/tags">Tags</Link>
          <Link to="/forum">Forums</Link>
        </div>
        {userData.id ? (
          <>
            <Link className="history" to={`/user/${userData.id}/history`}>
              History
            </Link>
            <div>{`Welcome, ${userData.first_name}!`}</div>
            {<div onClick={handleLogout}>Sign Out</div>}
          </>
        ) : (
          <div className="footer-auth">
            <Link to="/login">Sign In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
