import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import UserContext from "../../userContext";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useContext(UserContext);
  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const handleRegister = async (details) => {
    try {
      const response = await fetch("http://localhost:8080/register", {
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
        throw new Error(`Could not create user: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register">
      <h1 className="form-title">Sign Up</h1>
      <form
        className="form-portion"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister(details);
        }}
      >
        <label className="form-input-label" htmlFor="name">
          First Name:
        </label>
        <input
          type="text"
          name="firstName"
          className="form-input"
          placeholder="Enter your first name..."
          id="firstName"
          onChange={(e) =>
            setDetails({ ...details, first_name: e.target.value })
          }
          value={details.first_name}
        />
        <label className="form-input-label" htmlFor="name">
          Last Name:
        </label>
        <input
          type="text"
          name="lastName"
          className="form-input"
          placeholder="Enter your last name..."
          id="lastName"
          onChange={(e) =>
            setDetails({ ...details, last_name: e.target.value })
          }
          value={details.last_name}
        />
        <label className="form-input-label" htmlFor="name">
          Email:
        </label>
        <input
          type="email"
          name="email"
          className="form-input"
          placeholder="Enter your email..."
          id="email"
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
          value={details.email}
        />
        <button type="submit">Sign Up</button>{" "}
        <p className="form-footer">
          Already have an account? <Link to="/login">Click here!</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
