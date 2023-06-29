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
  //TODO - can we add different error codes for different errors here?
  const handleLogin = async (details) => {
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
        setUserData(data[0]);
        navigate("/");
      } else {
        throw new Error(`Could not log in: ${data.message}`);
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <div className="Login">
      <LoginForm handleLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
