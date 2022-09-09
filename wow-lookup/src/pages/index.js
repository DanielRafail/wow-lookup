import "../CSS/main.css";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useState } from "react";
import "../CSS/main.css";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

/**
 * Index page which asks player for Raider.IO URL (though wowlogs or checkpvp url works as well)
 * @returns HTML and logic components for the index page
 */
const Index = () => {
  let [url, seturl] = useState(0);
  let [error, seterror] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    if (typeof url === "object" || typeof error === "object") {
      seturl("");
      seterror(false);
    }
  }, [url, error]);

  /**
   * Get the value of the input tag and set the URL value with it
   * @param {Object} event object from which we will get the value and set the URL
   */
  function UpdateInput(event) {
    seturl(event.target.value);
  }

  /**
   * Submit the form and move to the next page
   */
  function HandleSubmit() {
    const parsedString = parseString(url);
    if (
      parsedString.characterRegion &&
      parsedString.characterServer &&
      parsedString.characterName
    ){
        navigate(
            `/lookup/${
              parsedString.characterRegion +
              "&" +
              parsedString.characterServer +
              "&" +
              parsedString.characterName
            }`
          );
    }
      
    else {
        seterror(true);
    }
    
  }

  /**
   * Get the position of a value within a String after a certain amount of repetitions
   * @param {string} string the String we will use
   * @param {string} subString the substring we are looking for
   * @param {int} index after how many repititons we get the position
   * @returns position of the substring after an index amount of repitions
   */
  function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  /**
   * Get the substring within a startindex and endIndex
   * @param {string} string the string we will get the substring of
   * @param {int} startIndex the start index for getting the substring
   * @param {int} endIndex  the end index for getting the substring
   * @returns substring within a startindex and endindex
   */
  function getSubstring(string, startIndex, endIndex) {
    // + 1 to remove the /
    const sIndex = getPosition(string, "/", startIndex) + 1;
    const eIndex = getPosition(string, "/", endIndex);
    const returnvalue = string.substring(sIndex, eIndex);
    return returnvalue;
  }

  /**
   * Parse the URL string to get relevant information
   * @returns dictionary object containing useful character information
   */
  function parseString() {
    const characterName = getSubstring(
      url,
      url.split("/").length - 1,
      url.split("/").length
    );
    const characterServer = getSubstring(
      url,
      url.split("/").length - 2,
      url.split("/").length - 1
    );
    const characterRegion = getSubstring(
      url,
      url.split("/").length - 3,
      url.split("/").length - 2
    );
    return {
      characterRegion: characterRegion,
      characterServer: characterServer,
      characterName: characterName,
    };
  }

  return (
    <div className="main">
      <div className="body">
        <h2 className="header-title">Paste the player's Raider.io URL</h2>
        <form id="lookup-form">
          <input
            type="text"
            id="io_url"
            name="io_url"
            placeholder="https://raider.io/characters/region/server/name"
            onChange={(e) => UpdateInput(e)}
          />
          <IconButton
            style={{ transform: "scale(1.8)", color: "white" }}
            onClick={() => HandleSubmit()}
          >
            <SendIcon />
          </IconButton>
        </form>
        {error === true ? <p className="error-p">The URL entered is invalid</p> : <React.Fragment/>}
      </div>
    </div>
  );
};

export default Index;
