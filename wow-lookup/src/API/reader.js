import "../CSS/main.css";
import axios from "axios";
import React from "react";

/**
 * The reader class that will send requests to the APIs, read them and respond to them
 */
class Reader extends React.Component {
  /**
   * API call to get the relevant information from raiderIO
   * @param {string} urlParams The URL parameters which include the character name, server and region
   * @param {boolean} setError Boolean that changes if the request fails
   * @param {Function} responseHandler A function to handle how the response will be handled
   */
  static async getRaiderIOData(urlParams) {
    const characterInfoArray = urlParams.split("&");
    return await axios
      .get("https://raider.io/api/v1/characters/profile", {
        params: {
          region: characterInfoArray[0],
          realm: characterInfoArray[1],
          name: characterInfoArray[2],
          fields:
            "mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs:all,mythic_plus_alternate_runs:all",
        },
      })
  }

  /**
   * API call to get the relevant information from wowlogs
   * @param {string} urlParams The URL parameters which include the character name, server and region
   * @param {boolean} setError Boolean that changes if the request fails
   * @param {Function} responseHandler A function to handle how the response will be handled
   */
  static getWowlogsData(urlParams, setError, responseHandler) {}

  /**
   * API call to get the relevant information from checkPVP
   * @param {string} urlParams The URL parameters which include the character name, server and region
   * @param {boolean} setError Boolean that changes if the request fails
   * @param {Function} responseHandler A function to handle how the response will be handled
   */
  static getCheckPVPData(urlParams, setError, responseHandler) {}
}

export default Reader;
