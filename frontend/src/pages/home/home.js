import React from "react";
import { useState } from "react";
import { Search } from "../../components/index";
import "./home.css";

const Home = () => {
  return (
    <>
      <div className="home">
        <h1>WikiForces</h1>
        <img src="/image.png" alt="eagle" />
        <Search />
      </div>
    </>
  );
};

export default Home;
