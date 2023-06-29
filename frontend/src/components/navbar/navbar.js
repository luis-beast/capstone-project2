import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import UserContext from "../../userContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useContext(UserContext);
  const handleLogout = () => {
    setUserData({});
    window.location.reload(false);
  };
  const { pathname } = useLocation();

  const refreshIfHere = (path) => {
    if (pathname === path) {
      window.location.reload(false);
    }
  };

  return (
    <div className="NavbarContainer">
      <div className="NavbarLinks">
        <img
          className="NavbarLogo"
          src="/image.png"
          alt="WikiForces"
          onClick={() => navigate("/")}
        />

        <Link to="/tags" onClick={() => refreshIfHere("/tags")}>
          Tags
        </Link>
        <Link
          to="/search"
          onClick={() => refreshIfHere("/search")}
          state={{ initialSearch: "tag:innovation" }}
        >
          Innovations
        </Link>
        <Link to="/forum" onClick={() => refreshIfHere("/forum")}>
          Forums
        </Link>
      </div>
      <div className="navbar-auth">
        {userData.id ? (
          <>
            <Link
              className="history-link"
              onClick={() => refreshIfHere(`/user/${userData.id}/history`)}
              to={`/user/${userData.id}/history`}
            >
              History
            </Link>
            <h3 onClick={handleLogout}>Sign Out</h3>
          </>
        ) : (
          <>
            <Link
              className="login-link"
              onClick={() => refreshIfHere("/login")}
              to="/login"
            >
              Sign In
            </Link>
            <Link
              className="register-link"
              onClick={() => refreshIfHere("/register")}
              to="/register"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
