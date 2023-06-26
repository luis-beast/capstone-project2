import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import UserContext from "../../userContext";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useContext(UserContext);
  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const handleRegister = async (details) => {
    console.log(details);
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister(details);
      }}
    >
      <div className="form-inner">
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="name">First Name:</label>
          <input
            className="firstName-input"
            type="text"
            name="firstName"
            id="firstName"
            onChange={(e) =>
              setDetails({ ...details, first_name: e.target.value })
            }
            value={details.first_name}
          />
          <label htmlFor="name">Last Name:</label>
          <input
            className="lastName-input"
            type="text"
            name="lastName"
            id="lastName"
            onChange={(e) =>
              setDetails({ ...details, last_name: e.target.value })
            }
            value={details.last_name}
          />
          <label htmlFor="name">Email:</label>
          <input
            className="email-input"
            type="email"
            name="email"
            id="email"
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            value={details.email}
          />
        </div>
        <input type="submit" value="SIGN UP" />
        <p>
          Already have an account? <Link to="/login">Click here!</Link>
        </p>
      </div>
    </form>
  );
};

export default Register;
