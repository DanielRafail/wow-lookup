import "../CSS/main.css";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
// import SendIcon from "@mui/icons-material/Send";
import Helper from "../Helper/helper.js";
import ApiCaller from "../API/apiCaller.js";
import WowGeneralParser from "../API/parser/wowGeneralParser.js";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

/**
 * Index page which asks player for Raider.IO URL (though wowlogs or checkpvp url works as well)
 * @returns HTML and logic components for the index page
 */
const Index = () => {
  let [name, setName] = useState("");
  let [region, setRegion] = useState("");
  let [server, setServer] = useState("");
  let [inputsError, setInputserror] = useState(false);
  let [singleInputError, setSingleInputError] = useState(false);
  let [url, seturl] = useState("");
  let [inputTypeURL, setInputTypeURL] = useState(false);
  let [servers, setServers] = useState(0);
  let [serversError, setServersError] = useState(false);
  let [openInput, setOpenInput] = useState(false);
  let [inputValue, setInputValue] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    if (!servers) seversAPICall();
    let serversInterval = setInterval(() => {
      seversAPICall();
    }, 6000);
    if (servers || setServersError === 404) clearInterval(serversInterval);
    return () => {
      clearInterval(serversInterval);
    };
  }, [
    name,
    region,
    server,
    url,
    inputsError,
    singleInputError,
    inputTypeURL,
    servers,
    serversError,
  ]);

  /**
   * Get the servers from an API call
   */
  function seversAPICall() {
    ApiCaller.getServers()
      .then(function (response) {
        if (response) {
          setServers(WowGeneralParser.parseServers(response));
        }
      })
      .catch(function (error) {
        console.log(error);
        setServersError(error.response.status);
      });
  }

  /**
   * Update the name state variable
   * @param {Object} event event object from which we will get the value and set the URL
   */
  function updateName(event) {
    setName(event.target.value.replace(/[^a-z]/gi, "").toLowerCase());
  }

  /**
   * Submit the form and move to the next page
   */
  function HandleSubmitInputs() {
    if (name && region && server) {
      navigate(`/lookup/${region + "&" + server + "&" + name}`);
    } else {
      setInputserror(true);
    }
  }

  /**
   * When the user choses the input type
   */
  function HandleInputType() {
    setInputserror(false);
    setSingleInputError(false);
    setInputTypeURL(!inputTypeURL);
  }

  /**
   * Submit the form and move to the next page
   */
  function HandleSubmitUrl() {
    if (url) {
      const parsedString = parseString(url);
      if (
        parsedString.characterRegion &&
        parsedString.characterServer &&
        parsedString.characterName
      ) {
        navigate(
          `/lookup/${
            parsedString.characterRegion +
            "&" +
            parsedString.characterServer +
            "&" +
            parsedString.characterName
          }`
        );
      } else {
        setSingleInputError(true);
      }
    } else setSingleInputError(true);
  }

  /**
   * Parse the URL string to get relevant information
   * @returns dictionary object containing useful character information
   */
  function parseString(url) {
    const split_url_length = url.split("/").length;
    const characterName = Helper.getSubstring(
      url,
      split_url_length - 1,
      split_url_length
    );
    const characterServer = Helper.getSubstring(
      url,
      split_url_length - 2,
      split_url_length - 1
    );
    const characterRegion = Helper.getSubstring(
      url,
      split_url_length - 3,
      split_url_length - 2
    );
    return {
      characterRegion: characterRegion,
      characterServer: characterServer,
      characterName: characterName,
    };
  }

  /**
   * Get the value of the input tag and set the URL value with it
   * @param {Object} event object from which we will get the value and set the URL
   */
  function UpdateInput(event) {
    seturl(event.target.value);
  }

  /**
   * Function to handle when the auto complete input menu is open
   */
  function handleOpenInput() {
    if (inputValue.length > 0) {
      setOpenInput(true);
    }
  }

  /**
   * Function to handle when the auto complete input menu has a change (values being written or deleted)
   * @param {Object} event the event of the values being written or deleted
   * @param {string} newInputValue the new input after the event has taken place
   */
  function handleInputChange(event, newInputValue) {
    if (typeof newInputValue === "string") {
      setInputValue(newInputValue);
      if (newInputValue.length > 0) {
        setOpenInput(true);
        setServer(
          newInputValue
            .substring(0, newInputValue.lastIndexOf("-"))
            .toLowerCase()
            .replace(" ", "-")
        );
        setRegion(
          newInputValue
            .substring(newInputValue.lastIndexOf("-") + 1)
            .toLowerCase()
        );
      } else {
        setOpenInput(false);
      }
    }
  }

  /**
   * Function to display user input with multiple inputs
   * @returns user inputs with multiple inputs
   */
  function getInputs() {
    const defaultFilterOptions = createFilterOptions();
    const filterOptions = (options, state) => {
      return defaultFilterOptions(options, state).slice(0, 5);
    };
    return (
      <div>
        <div className="name-line-index">
          <p className="name-label">Character Name: </p>
          <input
            type="text"
            className="name-input"
            name="name"
            placeholder="Player name"
            onChange={updateName}
          />
        </div>
        <div className="server-line-index">
          <p className="server-label">Server: </p>
          <Autocomplete
            disablePortal
            filterOptions={filterOptions}
            className="server-input"
            options={servers ? servers : []}
            onChange={handleInputChange}
            autoComplete={true}
            autoHighlight={true}
            autoSelect={true}
            open={openInput}
            onOpen={handleOpenInput}
            onClose={() => setOpenInput(false)}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            getOptionLabel={(option, value) => option.label || ""}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value || ""
            }
            renderInput={(params) => (
              <TextField
                className="auto-complete-textfield"
                placeholder="Server name"
                {...params}
              />
            )}
          />
          {serversError ? (
            <p className="error-p">Error loading every server</p>
          ) : (
            <React.Fragment />
          )}
        </div>
        {inputsError ? (
          <p className="error-p">Please do not leave an input empty</p>
        ) : (
          <React.Fragment />
        )}
        <Button
          variant="contained"
          className="index-submit-button"
          size="large"
          onClick={HandleSubmitInputs}
        >
          Submit
        </Button>
      </div>
    );
  }

  /**
   * Function to display user input with a single inputs
   * @returns user input with a single input
   */
  function getSingleInput() {
    return (
      <div>
        <p className="url-label">Player's URL: </p>
        <p className="sub-label">
          This functions with RaiderIO, WarcraftLogs and CheckPVP URLs
        </p>
        <input
          type="text"
          id="io_url"
          name="io_url"
          placeholder="https://raider.io/characters/region/server/name"
          onChange={UpdateInput}
        />
        {/* <IconButton
          style={{ transform: "scale(1.8)", color: "white" }}
          onClick={HandleSubmitUrl}
        >
          <SendIcon />
        </IconButton> */}
        <Button
          variant="contained"
          className="index-submit-button single-input-submit-button"
          size="large"
          onClick={HandleSubmitUrl}
        >
          Submit
        </Button>
        {singleInputError ? (
          <p className="error-p-url-input error-p">
            Please make sure to place a correct URL
          </p>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }

  /**
   * Get the width of the form based on which input type we are on
   * @returns the input width
   */
  function getFormWidth() {
    return inputTypeURL ? "100%" : "50%";
  }

  return (
    <div className="main">
      <div className="body">
        <h1 className="header-title">WoW-Lookup</h1>
        <Button
          variant="contained"
          className="index-input-type-button"
          size="large"
          onClick={HandleInputType}
        >
          {inputTypeURL ? "Find player with Name and Server" : "Find player with URL"}
        </Button>
        <form id="lookup-form" style={{ width: getFormWidth() }}>
          {inputTypeURL ? getSingleInput() : getInputs()}
        </form>
      </div>
    </div>
  );
};

export default Index;
