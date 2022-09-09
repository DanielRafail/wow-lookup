import "../CSS/main.css";
import React, { useState } from "react";
import "../CSS/main.css";
import Navigation from "../components/navigation.js";
import { useParams } from "react-router-dom";
import Summary from "../components/summary.js";
import { useNavigate } from "react-router-dom";


const Lookup = () => {
  let [navigation_tab_value, set_navigation_tab_value] = useState(0);
  let params = useParams();
  let navigate = useNavigate();
  return (
    <div className="main">
      <Navigation
        navigation_tab_value={navigation_tab_value}
        set_navigation_tab_value={set_navigation_tab_value}
        characterInfo = {params.url}
        navigate = {navigate}
      />
      <div className="body">{<Summary url={params.url} />}</div>
    </div>
  );
};

export default Lookup;
