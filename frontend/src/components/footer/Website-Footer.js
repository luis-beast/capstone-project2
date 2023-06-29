import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <div className="FooterContainer">
      <div className="FooterLinks">
        <Link to="/tags">Tags</Link>
        <Link to="/search" state={{ initialSearch: "tag:innovation" }}>
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

export default Footer;
