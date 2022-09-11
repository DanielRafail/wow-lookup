import "../CSS/main.css";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Helper from "../Helper/helper.js"

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
   * Parse the URL string to get relevant information
   * @returns dictionary object containing useful character information
   */
  function parseString() {
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
