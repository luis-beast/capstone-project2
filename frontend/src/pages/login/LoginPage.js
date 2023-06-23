import React, { useState, useContext } from "react";
import "./LoginPage.css";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
// an import for the context that you had

const LoginPage = () => {
  //const { isLoggedIn, setIsLoggedIn } = useContext(isLoggedInContext);
  const navigate = useNavigate();
  // fetch to our api at /login
  const loggedIn = async (details) => {
    console.log(details);
    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });
      const data = await response.json();
      //setIsLoggedIn(data);
      console.log(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Wrapper">
      <div className="Content">
        <div className="Login">
          <LoginForm Login={loggedIn} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
