import React, { useState, useContext } from "react";
import "./LoginPage.css";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import UserContext from "../../userContext";
import useLocalStorageState from "../../useLocalStorageState";
// an import for the context that you had

const LoginPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useContext(UserContext);

  // fetch to our api at /login
  const handleLogin = async (details) => {
    console.log(details);
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });
      const data = await response.json();

      if (data[0]) {
        console.log("Login Successful!");
        setUserData(data[0]);
        navigate("/");
      } else {
        console.log("Login Failed.");
      }
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
          <LoginForm handleLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
