import "../CSS/main.css";
import React, { useState, useEffect } from "react";
import "../CSS/main.css";
import Navigation from "../components/navigation.js";
import { useParams } from "react-router-dom";
import Summary from "../components/summary.js";
import { useNavigate } from "react-router-dom";
import Parser from "../API/parser";
import Reader from "../API/reader.js";

/**
 * main page (lookup page) which displays a summary of all the information, with individual links to each of them
 * @returns HTML and logic components for the main page (lookup page)
 */
const Lookup = () => {
  let [navigationTabValue, setNavigationTabValue] = useState(0);
  let [raiderIOValid, setRaiderIOValid] = useState(0);
  // let [wowlogsValid, setWowlogsValid] = useState(0);
  // let [checkPVPValid, setCheckPVP] = useState(0);
  let [parsedRaiderIOData, setRaiderIOData] = useState(0);
  let [parsedWowlogsData, setWowlogsData] = useState(0);
  let [parsedCheckPVPData, setcheckPVPData] = useState(0);
  let params = useParams();
  let navigate = useNavigate();
  let headers = ["Summary", "WoWlogs", "Raider.IO", "CheckPVP"];

  useEffect(() => {
    const raiderIOData = Reader.getRaiderIOData(params.url, setRaiderIOValid, Parser.parseRaiderIOData);
  }, [params]);

  /**
   * Function to handle changing tabs on the navigation menu
   */
  function HandleChange(event, v) {
    // Set the navigation tab back to 0 as it is the default and only interactive page, will leave this here in case I decide to create personalized pages for each website in the future
    setNavigationTabValue(0);
    //verify which tab we are on and select the link based on it (or send back to index)
    const correctPage = VerifyTab(v);
    if (correctPage !== null && correctPage !== -1) {
      window.open(correctPage, "_blank", "noopener,noreferrer");
    }
  }

  function raiderIODataHandler(){
    
  }

  /**
   *
   * @param {int} index Verify which tab we are on and select the appropriate website
   * @returns the appropriate website URL
   */
  function VerifyTab(index) {
    const characterInfo = params.url.replaceAll("&", "/");
    switch (index) {
      case 0:
        return null;
      case 1:
        return "https://www.warcraftlogs.com/character/" + characterInfo;
      case 2:
        return "https://raider.io/characters/" + characterInfo;
      case 3:
        return "https://check-pvp.fr/" + characterInfo;
      case -1:
        navigate("/");
        return -1;
      default:
        return null;
    }
  }

  return (
    <div className="main">
      <Navigation
        navigationTabValue={navigationTabValue}
        HandleChange={(e, v) => HandleChange(e, v)}
        headers={headers}
        homeButton={true}
      />
      <div className="body">
        {
          <Summary
            url={params.url}
            data={{
              raiderio: {parsedRaiderIOData},
              wowlogs: "",
              checkPVP: "",
            }}
          />
        }
      </div>
    </div>
  );
};

export default Lookup;
