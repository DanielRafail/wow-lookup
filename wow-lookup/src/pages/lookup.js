import "../CSS/main.css";
import React, { useState, useEffect } from "react";
import "../CSS/main.css";
import Navigation from "../components/navigation.js";
import { useParams } from "react-router-dom";
import Summary from "../components/summary.js";
import { useNavigate } from "react-router-dom";
import ApiCaller from "../API/apiCaller.js";
import CircularProgress from "@mui/material/CircularProgress";
import Helper from "../Helper/helper.js";

/**
 * main page (lookup page) which displays a summary of all the information, with individual links to each of them
 * @returns HTML and logic components for the main page (lookup page)
 */
const Lookup = () => {
  let [navigationTabValue, setNavigationTabValue] = useState(0);
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

    function fetchData(apiCall, setData) {
      apiCall(params.url)
        .then(function (response) {
          if (response && response.status === 200) {
            setData(response.data);
          }
        })
    }
    if (firstLoad) {
      const apiCalls = [
        fetchData(ApiCaller.getRaiderIOData, setRaiderIOData),
        fetchData(ApiCaller.getWowlogsData, setWowlogsData),
        fetchData(ApiCaller.getPVPData, setPVPParsedData),
      ];
      Promise.all(apiCalls);
      setFirstLoad(false);
    }

    if (!parsedRaiderIOData)
      raiderioInterval = setInterval(() => {
        fetchData(ApiCaller.getRaiderIOData, setRaiderIOData);
      }, 6000);
    if (!parsedWowlogsData)
      wowlogsInterval = setInterval(() => {
        fetchData(ApiCaller.getWowlogsData, setWowlogsData);
      }, 6000);
    if (!parsedPVPData)
      pvpInterval = setInterval(() => {
        fetchData(ApiCaller.getPVPData, setPVPParsedData);
      }, 6000);
    if (!parsedRaiderIOData && !parsedWowlogsData && !parsedPVPData) {
      timeout = setTimeout(function () {
        alert(
          "Error getting the character's information. Please make sure the information you gave is correct or the character exists"
        );
        navigate("/");
      }, 8000);
    }
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
    navigate,
    firstLoad,
  ]);

  /**
   * Function to handle changing tabs on the navigation menu
   */
  function HandleChange(event, v) {
    // Set the navigation tab back to 0 as it is the default and only interactive page, will leave this here in case I decide to create personalized pages for each website in the future
    setNavigationTabValue(0);
    console.log(v)
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
        {parsedRaiderIOData || parsedWowlogsData || parsedPVPData ? (
          <Summary
            data={{
              name: params.url.split("&")[2],
              server: params.url.split("&")[1],
              parsedRaiderIOData: parsedRaiderIOData,
              parsedWowlogsData: parsedWowlogsData,
              parsedPVPData: parsedPVPData,
            }}
            url={params.url}
          />
        ) : (
          <div>
            <CircularProgress size={100} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Lookup;
