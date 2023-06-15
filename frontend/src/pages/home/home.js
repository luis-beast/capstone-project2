import React from "react";
import { useState } from "react";
import Search from "../../components/search/search";
import logo from "./image.png";

const Home = () => {
  return (
    <>
      <div className="home">
        <img src={logo} alt="eagle" />
        <Search />
      </div>
    </>
  );
};

export default Home;
