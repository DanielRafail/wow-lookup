import "../CSS/main.css";
import React, { useState, useEffect } from "react";
import "../CSS/main.css";
import Navigation from "../components/navigation.js";
import { useParams } from "react-router-dom";
import Summary from "../components/summary.js";
import { useNavigate } from "react-router-dom";
import PvpParser from "../API/parser/pvpParser";
import WowlogsParser from "../API/parser/wowlogsParser";
import RaiderIOParser from "../API/parser/raiderioParser";
import Reader from "../API/reader.js";
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
      Reader.getColors()
        .then(function (response) {
          if (response && response.status === 200) {
            Reader.getAllDungeons()
              .then(function (secondResponse) {
                if (secondResponse && secondResponse.status === 200) {
                  Reader.getRaiderIOData(params.url)
                    .then(function (thirdResponse) {
                      if (thirdResponse && thirdResponse.status === 200) {
                        setRaiderIOError(false);
                        setRaiderIOData(
                          RaiderIOParser.parseRaiderIOData(
                            thirdResponse,
                            response,
                            secondResponse
                          )
                        );
                      }
                    })
                    .catch(function (thirdResponse) {
                      setWowlogsError(
                        thirdResponse.response && thirdResponse.response.status
                          ? thirdResponse.response.status
                          : 0
                      );
                    });
                }
              })
              .catch(function (secondError) {
                setWowlogsError(
                  secondError.response && secondError.response.status
                    ? secondError.response.status
                    : 404
                );
              });
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
    function wowlogsApiCall() {
      Reader.getClasses()
        .then(function (response) {
          if (response && response.status === 200) {
            Reader.getWowlogsData(params.url)
              .then(function (secondResponse) {
                if (secondResponse && secondResponse.status === 200) {
                  setWowlogsError(false);
                  setWowlogsData(
                    WowlogsParser.parseWowlogsData(secondResponse, response)
                  );
                }
              })
              .catch(function (secondError) {
                setWowlogsError(
                  secondError.response && secondError.response.status
                    ? secondError.response.status
                    : 404
                );
              });
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
      apiCall(
        Reader.getPVPData(params.url),
        setPVPParsedData,
        setPVPError,
        PvpParser.parsePVPData
      );
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
   * Function used to call a API, set data upon a response, and set an error upno a failure
   * @param {Function} apiCallFunction Function which decides which API to call
   * @param {Function} setData Function which sets the data in this class's state
   * @param {Function} setError Function which sets the appropriate error variable in this class's state
   */
  function apiCall(apiCallFunction, setData, setError, parserFunction) {
    apiCallFunction
      .then(function (response) {
        if (response && response.status === 200) {
          setError(false);
          setData(parserFunction(response));
        }
      })
      .catch(function (error) {
        setError(
          error.response && error.response.status ? error.response.status : 404
        );
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
        {(!parsedRaiderIOData && !parsedWowlogsData) ||
        (!parsedPVPData && !parsedRaiderIOData) ||
        (!parsedWowlogsData && !parsedPVPData) ? (
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
