import "../CSS/main.css";
import axios from "axios";
import React from "react";

/**
 * The reader class that will send requests to the APIs, read them and respond to them
 */
class ApiCaller extends React.Component {
  /**
   * API call to get the relevant information from raiderIO
   * @param {string} urlParams The URL parameters which include the character name, server and region
   */
  static async getRaiderIOData(urlParams) {
    const characterInfoArray = getCharacterInfoArray(urlParams);
    const options = {
      method: "GET",
      url:  process.env.REACT_APP_API_URL_BASE + "raiderio",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        name: characterInfoArray[2],
        server: characterInfoArray[1],
        region: characterInfoArray[0]
      },
    };
    return await axios.request(options);
  }

  /**
   * API call to get the relevant information from wowlogs
   * @param {string} urlParams The URL parameters which include the character name, server and region
   */
  static async getWowlogsData(urlParams) {
    const characterInfoArray = getCharacterInfoArray(urlParams);
    const options = {
      method: "GET",
      url: process.env.REACT_APP_API_URL_BASE + "wowlogs",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        name: characterInfoArray[2].toLowerCase(),
        server: characterInfoArray[1].toLowerCase(),
        region: characterInfoArray[0].toLowerCase(),
      },
    };
    return await axios.request(options);
  }

  /**
   * API call to get the relevant information from pvp
   * @param {string} urlParams The URL parameters which include the character name, server and region
   */
  static async getPVPData(urlParams) {
    const characterInfoArray = getCharacterInfoArray(urlParams);
    const options = {
      method: "GET",
      url: process.env.REACT_APP_API_URL_BASE + "pvp",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        name: characterInfoArray[2].toLowerCase(),
        server: characterInfoArray[1].toLowerCase(),
        region: characterInfoArray[0].toLowerCase(),
      },
    };
    return await axios.request(options);
  }

  /**
   * API call to get all servers
   * @returns Dictionary with all servers
   */
  static async F() {
    console.log(process.env.REACT_APP_API_URL_BASE)
    const options = {
      method: "GET",
      url: process.env.REACT_APP_API_URL_BASE + "servers",
      headers: {
        "Content-Type": "application/json",
      },
    };
    return await axios.request(options);
  }
}

export default ApiCaller;
/**
 * Split a string based on the & character
 * @param {*} url the string to be split
 * @returns an array with the string split
 */
function getCharacterInfoArray(url) {
  return url.split("&");
}
