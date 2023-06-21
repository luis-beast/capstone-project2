import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <div className="NavbarContainer">
      <div className="NavbarLinks">
        <img
          className="NavbarLogo"
          src="/image.png"
          alt="WikiForces"
          onClick={() => (window.location.href = "/")}
        />
        <Link to="/tags">Tags</Link>
        <Link to="/search" state={{ initialSearch: "tag:Innovation" }}>
          Innovations
        </Link>
        <Link to="/forum">Forum</Link>
      </div>
      <div className="NavbarAuth">
        <Link className="login" to="/login">
          Sign In
        </Link>
        <Link className="register" to="/register">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
