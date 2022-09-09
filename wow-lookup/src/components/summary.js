import "../CSS/main.css";
import React from "react";
import "../CSS/main.css";
import { useParams } from "react-router-dom";

/**
 * Summary page which will show information about your WoWlogs, Raider.IO and CheckPVP in one compact location
 * @returns HTML and logic components for the Summary page
 */
const Summary = () => {
  let params = useParams();
  //use params.url
  /*       <a href="https://www.warcraftlogs.com/character/us/illidan/leeroys">asdasd</a> */

  return (
    <div className="summary-main">
        <p>yo</p>
    </div>
  );
};

export default Summary;
