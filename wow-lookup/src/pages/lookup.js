import "../CSS/main.css";
import React, { useState, useEffect } from "react";
import "../CSS/main.css";
import Navigation from "../components/navigation.js";
import { useParams } from "react-router-dom";
import Summary from "../components/summary.js";
import { useNavigate } from "react-router-dom";
import Parser from "../API/parser";
import Reader from "../API/reader.js";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * main page (lookup page) which displays a summary of all the information, with individual links to each of them
 * @returns HTML and logic components for the main page (lookup page)
 */
const Lookup = () => {
  let [navigationTabValue, setNavigationTabValue] = useState(0);
  let [raiderIOError, setRaiderIOError] = useState(0);
  let [wowlogsError, setWowlogsError] = useState(0);
  let [pvpError, setPVPError] = useState(0);
  let [parsedRaiderIOData, setRaiderIOData] = useState(0);
  let [parsedWowlogsData, setWowlogsData] = useState(0);
  let [parsedPVPData, setPVPParsedData] = useState(0);
  let params = useParams();
  let navigate = useNavigate();
  let headers = ["Summary", "WoWlogs", "Raider.IO", "CheckPVP"];

  useEffect(() => {
    let timeout;
    apiCall(
      Reader.getRaiderIOData(params.url),
      setRaiderIOData,
      setRaiderIOError,
      Parser.parseRaiderIOData
    );
    apiCall(
      Reader.getWowlogsData(params.url),
      setWowlogsData,
      setWowlogsError,
      Parser.parseWowlogsData
    );
    apiCall(
      Reader.getPVPData(params.url),
      setPVPParsedData,
      setPVPError,
      Parser.parsePVPData
    );
    if (!parsedRaiderIOData && !parsedWowlogsData && !parsedPVPData) {
      timeout = setTimeout(function () {
        alert("Error getting the character's information. Please make sure the link you gave is correct or the character exists");
        navigate("/")
      }, 5000);
    }
    return () => clearTimeout(timeout)
  }, [params.url, parsedRaiderIOData, parsedWowlogsData, parsedPVPData, navigate]);

  /**
   * Function used to call a API, set data upon a response, and set an error upno a failure
   * @param {Function} apiCallFunction Function which decides which API to call
   * @param {Function} setData Function which sets the data in this class's state
   * @param {Function} setError Function which sets the appropriate error variable in this class's state
   */
  function apiCall(apiCallFunction, setData, setError, parserFunction) {
    apiCallFunction
      .then(function (response) {
        if (response) {
          setError(false);
          setData(parserFunction(response));
        }
      })
      .catch(function (error) {
        setError(true, error);
        console.log(error);
      });
  }

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
        {!parsedRaiderIOData && !parsedWowlogsData && !parsedPVPData ? (
          <div>
            <CircularProgress size={100}/>
          </div>
        ) : (
          <Summary
            data={{
              name: params.url.split("&")[2],
              server: params.url.split("&")[1],
              parsedRaiderIOData: parsedRaiderIOData,
              raiderIOError: raiderIOError,
              parsedWowlogsData: parsedWowlogsData,
              wowlogsError: wowlogsError,
              parsedPVPData: parsedPVPData,
              pvpError: pvpError,
            }}
            url={params.url}
          />
        )}
      </div>
    </div>
  );
};

export default Lookup;
