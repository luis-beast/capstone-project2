import React from "react";
import { useState } from "react";
import Search from "../../components/search/search";
import logo from "./image.png";
import "./home.css";

const Home = () => {
  return (
    <>
      <div className="home">
        <h1>WikiForces</h1>
        <img src={logo} alt="eagle" />
        <Search />
      </div>
    </>
  );
};

export default Home;
