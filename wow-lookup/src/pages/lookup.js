import "../CSS/main.css";
import React, { useState, useEffect } from "react";
import "../CSS/main.css";
import Navigation from "../components/navigation.js";
import { useParams } from "react-router-dom";
import Summary from "../components/summary.js";
import { useNavigate } from "react-router-dom";
import WowlogsParser from "../API/parser/wowlogsParser";
import RaiderIOParser from "../API/parser/raiderioParser";
import ApiCaller from "../API/apiCaller.js";
import CircularProgress from "@mui/material/CircularProgress";
import Helper from "../Helper/helper.js";

/**
 * main page (lookup page) which displays a summary of all the information, with individual links to each of them
 * @returns HTML and logic components for the main page (lookup page)
 */
const Lookup = () => {
  let [navigationTabValue, setNavigationTabValue] = useState(0);
  let [raiderIOError, setRaiderIOError] = useState(false);
  let [wowlogsError, setWowlogsError] = useState(false);
  let [pvpError, setPVPError] = useState(false);
  let [parsedRaiderIOData, setRaiderIOData] = useState(0);
  let [parsedWowlogsData, setWowlogsData] = useState(0);
  let [parsedPVPData, setPVPParsedData] = useState(0);
  let [firstLoad, setFirstLoad] = useState(true);
  let params = useParams();
  let navigate = useNavigate();
  let headers = ["Summary", "Raider.IO", "WoWlogs", "CheckPVP"];

  useEffect(() => {
    let timeout;
    let raiderioInterval;
    let pvpInterval;
    let wowlogsInterval;
    //declaring timeout to show error message after 5 seconds
    //declaring all API calls since they will be used twice
    function raiderIOApiCall() {
      ApiCaller.getRaiderIOData(params.url)
        .then(function (response) {
          if (response && response.status === 200) {
            setRaiderIOError(false);
            setRaiderIOData(
              RaiderIOParser.parseRaiderIOData(
                response.data.raiderIO,
                response.data.colors,
                response.data.dungeons
              )
            );
          }
        })
        .catch(function (error) {
          setWowlogsError(
            error.response && error.response.status ? error.response.status : 0
          );
        });
    }
    function wowlogsApiCall() {
      ApiCaller.getWowlogsData(params.url)
        .then(function (response) {
          if (response && response.status === 200) {
            setWowlogsError(false);
            setWowlogsData(
              WowlogsParser.parseWowlogsData(
                response.data.wowlogs,
                response.data.classes
              )
            );
          }
        })
        .catch(function (error) {
          setWowlogsError(
            error.response && error.response.status
              ? error.response.status
              : 404
          );
        });
    }
    function pvpApiCall() {
      ApiCaller.getPVPData(params.url)
        .then(function (response) {
          if (response && response.status === 200) {
            setPVPError(false);
            setPVPParsedData(response.data);
          }
        })
        .catch(function (error) {
          setPVPError(
            error.response && error.response.status
              ? error.response.status
              : 404
          );
        });
    }
    if (firstLoad) {
      raiderIOApiCall();
      wowlogsApiCall();
      pvpApiCall();
      setFirstLoad(false);
    }

    //setting intervals to call APIs (will be removed once we get a response)
    if (!parsedRaiderIOData)
      raiderioInterval = setInterval(() => {
        raiderIOApiCall();
      }, 6000);
    if (!parsedWowlogsData)
      wowlogsInterval = setInterval(() => {
        wowlogsApiCall();
      }, 6000);
    if (!parsedPVPData)
      pvpInterval = setInterval(() => {
        pvpApiCall();
      }, 6000);
    //Removing API calls intervals once we get a response
    if (parsedRaiderIOData || raiderIOError === 404)
      clearInterval(raiderioInterval);
    if (parsedWowlogsData || wowlogsError === 404)
      clearInterval(wowlogsInterval);
    if (parsedPVPData || pvpError === 404) clearInterval(pvpInterval);
    //setting timeout if none of the APIs give an answer back (most likely falsy URL) OR if initial undefined state
    //also calling APIs here originally
    if (!parsedRaiderIOData && !parsedWowlogsData && !parsedPVPData) {
      timeout = setTimeout(function () {
        alert(
          "Error getting the character's information. Please make sure the information you gave is correct or the character exists"
        );
        navigate("/");
      }, 5000);
    }
    //clear everything on unmount
    return () => {
      clearTimeout(timeout);
      clearInterval(raiderioInterval);
      clearInterval(wowlogsInterval);
      clearInterval(pvpInterval);
    };
  }, [
    params.url,
    parsedRaiderIOData,
    parsedWowlogsData,
    parsedPVPData,
    pvpError,
    raiderIOError,
    wowlogsError,
    navigate,
    firstLoad,
  ]);

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
        return "https://raider.io/characters/" + characterInfo;
      case 2:
        return "https://www.warcraftlogs.com/character/" + characterInfo;
      case 3:
        //playing with capital letters and spacing so that the website accepts the player url
        let splitURL = characterInfo.split("/");
        let serverSection = splitURL[1].split("-");
        let serverSectionCapitalized = serverSection.map((a, i) => {
          return Helper.capitalizeFirstLetter(a);
        });
        splitURL[1] = serverSectionCapitalized.join(" ");
        splitURL[2] = Helper.capitalizeFirstLetter(splitURL[2]);
        splitURL = splitURL.join("/");
        return "https://check-pvp.fr/" + splitURL;
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
        {!parsedRaiderIOData || !parsedWowlogsData || !parsedPVPData ? (
          <div>
            <CircularProgress size={100} />
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
