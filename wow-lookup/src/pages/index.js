import "../CSS/main.css";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useState } from "react";
import "../CSS/main.css";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

const Index = () => {
  let [url, seturl] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    if (typeof url === "object") {
      seturl("");
    }
  });

  /**
   * update the input tag value
   */
  function UpdateInput(event) {
    seturl(event.target.value);
  }

  /**
   * submit the form
   */
  function HandleSubmit(event) {
    const parsedString = parseString(url);
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

  /**
   * Get the position of a value within a String after a certain amount of repetitions
   */
  function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  /**
   * Get the substring within a startindex and endIndex
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
            onClick={(e) => HandleSubmit(e)}
          >
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
};

export default Index;
