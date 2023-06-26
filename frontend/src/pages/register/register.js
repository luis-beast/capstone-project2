import React, { useState } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  return (
    <form>
      <div className="form-inner">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="name">Email:</label>
          <input
            className="firstName-input"
            type="text"
            name="firstName"
            id="firstName"
            onChange={(e) =>
              setDetails({ ...details, firstName: e.target.value })
            }
            value={details.email}
          />
          <input
            className="lName-input"
            type="text"
            name="lastName"
            id="lastName"
            onChange={(e) =>
              setDetails({ ...details, lastName: e.target.value })
            }
            value={details.email}
          />
          <input
            className="email-input"
            type="email"
            name="email"
            id="email"
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            value={details.email}
          />
        </div>
        <input type="submit" value="LOGIN" />
        <p>
          Already have an account? <Link to="/login">Click here!</Link>
        </p>
      </div>
    </form>
  );
};

export default Register;
