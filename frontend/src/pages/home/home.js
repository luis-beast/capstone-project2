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

  const handleSubmit = (e) => {
    navigate("/search", { state: { initialSearch: searchInput } });
  };

  const handleLogout = () => {
    setUserData({});
    window.location.reload(false);
  };

  return (
    <div className="home">
      <h1>
        <span>Wiki</span>
        <span>Forces</span>
      </h1>
      <img src="/image.png" alt="eagle" />
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search for a wikipage..."
          onChange={handleChange}
          value={searchInput}
        />
        <button type="submit">Search</button>
      </form>
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/add-wiki">Add WikiPage</Link>
          <Link to="/tags">Tags</Link>
          <Link to="/forum">Forums</Link>
        </div>
        <div className="footer-auth">
          {userData.id ? (
            <>
              <Link className="history" to={`/user/${userData.id}/history`}>
                History
              </Link>
              <div>{`Welcome, ${userData.first_name}!`}</div>
              {<h3 onClick={handleLogout}>Sign Out</h3>}
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
