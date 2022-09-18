import "../CSS/main.css";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Helper from "../Helper/helper.js";

/**
 * Index page which asks player for Raider.IO URL (though wowlogs or checkpvp url works as well)
 * @returns HTML and logic components for the index page
 */
const Index = () => {
  let [name, setName] = useState(0);
  let [region, setRegion] = useState(0);
  let [server, setServer] = useState(0);
  let [inputsError, setInputserror] = useState(0);
  let [singleInputError, setSingleInputError] = useState(0);
  let [url, seturl] = useState(0);
  let [inputTypeURL, setInputTypeURL] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    if (
      typeof name === "object" &&
      typeof region === "object" &&
      typeof server === "object" &&
      typeof url === "object" &&
      typeof inputTypeURL === "object" &&
      typeof inputsError === "object" &&
      typeof singleInputError === "object"
    ) {
      setName("");
      setRegion("");
      setServer("");
      seturl("");
      setInputTypeURL(false);
      setSingleInputError(false);
      setInputserror(false);
    }
  }, [name, region, server, url, inputsError, singleInputError, inputTypeURL]);

  /**
   * Update the name state variable
   * @param {Object} event object from which we will get the value and set the URL
   */
  function updateName(event) {
    setName(event.target.value.replace(/[^a-z]/gi, "").toLowerCase());
  }

  /**
   * Update the server state variable
   * @param {Object} event object from which we will get the value and set the URL
   */
  function updateServer(event) {
    setServer(event.target.value.replace(/[^a-z\-\.\']/gi, "").toLowerCase());
  }

  /**
   * Update the region state variable
   * @param {Object} event object from which we will get the value and set the URL
   */
  function updateRegion(event) {
    setRegion(event.target.value.replace(/[^a-z]/gi, "").toLowerCase());
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
   * Function to display user input with multiple inputs
   * @returns user inputs with multiple inputs
   */
  function getInputs() {
    return (
      <div>
        <div className="name-line-index">
          <p className="name-label">Character Name: </p>
          <input
            type="text"
            className="name-input"
            name="name"
            placeholder="Playername"
            onChange={updateName}
          />
        </div>
        <div className="server-line-index">
          <p className="server-label">Server: </p>
          <input
            type="text"
            className="server-input"
            name="server"
            placeholder="Tichondrius"
            onChange={updateServer}
          />
        </div>
        <div className="region-line-index">
          <p className="region-label">Region: </p>
          <input
            type="text"
            className="region-input"
            name="region"
            placeholder="US/EU/..."
            onChange={updateRegion}
          />
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

  function getSingleInput() {
    return (
      <div>
        <p className="url-label">RaiderIO URL: </p>
        <input
          type="text"
          id="io_url"
          name="io_url"
          placeholder="https://raider.io/characters/region/server/name"
          onChange={UpdateInput}
        />
        <IconButton
          style={{ transform: "scale(1.8)", color: "white" }}
          onClick={HandleSubmitUrl}
        >
          <SendIcon />
        </IconButton>
        {singleInputError ? (
          <p className="error-p-url-input error-p">Please make sure to place a correct URL</p>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }

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
          {inputTypeURL
            ? "Use inputs to find player"
            : "Use URL to find player"}
        </Button>
        <form id="lookup-form" style={{ width: getFormWidth() }}>
          {inputTypeURL ? getSingleInput() : getInputs()}
        </form>
      </div>
    </div>
  );
};

export default Index;
