import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm({ Login }) {
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const submitHandler = (e) => {
    e.preventDefault();
    Login(details);
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-inner">
        <h2>Login</h2>
        <div className="form-group">
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
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) =>
              setDetails({ ...details, password: e.target.value })
            }
            value={details.pasword}
          />
        </div>
        <input type="submit" value="LOGIN" />
        <p>
          Do not have an account? <Link to="/register">Click here!</Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
