import "../CSS/main.css";
import React, { useState } from "react";
import "../CSS/main.css";
import Navigation from "../components/navigation.js";
import { useParams } from "react-router-dom";

const Errorpage = () => {
  let params = useParams();
  //use params.url

  return (
    <div class="main">
      <div className="body errorpage-main">
        <p>404 | NOT FOUND</p>
      </div>
    </div>
  );
};

export default Errorpage;
