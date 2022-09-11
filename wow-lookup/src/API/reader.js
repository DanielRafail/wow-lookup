import "../CSS/main.css";
import axios from "axios";
import React from "react";

/**
 * Summary page which will show information about your WoWlogs, Raider.IO and CheckPVP in one compact location
 * @returns HTML and logic components for the Summary page
 */
class Reader extends React.Component {
  static getRaiderIOData(urlParams, setError, responseHandler){
    const characterInfoArray = urlParams.split("&");
    axios
      .get("https://raider.io/api/v1/characters/profile", {
        params: {
          region: characterInfoArray[0],
          realm: characterInfoArray[1],
          name: characterInfoArray[2],
          fields:
            "mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs:all,mythic_plus_alternate_runs:all",
        },
      })
      .then(function (response) {
        if (response) {
          setError(true);
          responseHandler(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  static getWowlogsData(urlParams, setError) {}

  static getCheckPVPData(urlParams, setError) {}
}

export default Reader;
