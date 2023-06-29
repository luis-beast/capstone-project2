import React from "react";
import { useState, useContext } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import { Search } from "../../components/index";
import "./home.css";
import UserContext from "../../userContext";
import { BiSearch } from "react-icons/bi";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [userData, setUserData] = useContext(UserContext);

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
        <span>WikiForces</span>
      </h1>
      {userData.id ? (
        <>
          <h3>{`Welcome, ${userData.first_name}`}</h3>
        </>
      ) : null}
      <img src="/image.png" alt="eagle" />
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search for a wikipage..."
          onChange={handleChange}
          value={searchInput}
        />
        <button type="submit" className="search-icon">
          <BiSearch style={{ position: "relative", top: "3px" }} /> Search
        </button>
      </form>
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/tags">Tags</Link>
          <Link to="/search" state={{ initialSearch: "tag:innovation" }}>
            Innovation
          </Link>
          <Link to="/forum">Forums</Link>
        </div>
        <div className="footer-auth">
          {userData.id ? (
            <>
              {/* <div>{`Welcome, ${userData.first_name}!`}</div> */}
              <Link className="history" to={`/user/${userData.id}/history`}>
                History
              </Link>
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
