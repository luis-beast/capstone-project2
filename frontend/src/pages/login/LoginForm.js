import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm({ handleLogin }) {
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(details);
  };

  return (
    <div className="register">
      <h1 className="form-title">Sign In</h1>
      <form className="form-portion" onSubmit={submitHandler}>
        <label className="form-input-label" htmlFor="email">
          Email:
        </label>
        <div className="form-input">
          <input
            className="email-input"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email..."
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            value={details.email}
          />
        </div>
        <button className="form-button" type="submit">
          Sign In
        </button>
        <p className="form-footer">
          Don't have an account? <Link to="/register">Click here!</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
