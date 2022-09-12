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
   */
  static async getRaiderIOData(urlParams) {
    const characterInfoArray = getCharacterInfoArray(urlParams);
    return await axios.get("https://raider.io/api/v1/characters/profile", {
      params: {
        region: characterInfoArray[0],
        realm: characterInfoArray[1],
        name: characterInfoArray[2],
        fields:
          "mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs:all,mythic_plus_alternate_runs:all",
      },
    });
  }

  /**
   * API call to get the relevant information from wowlogs
   * @param {string} urlParams The URL parameters which include the character name, server and region
   */
  static async getWowlogsData(urlParams) {
    const characterInfoArray = getCharacterInfoArray(urlParams);
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NzM4MDY3OC0yZjU0LTQ4ZWUtYjMzZi03ZDEzY2Q2ZDZjMmMiLCJqdGkiOiI1MDVmZGY4Njg3M2QzMDkxZWI0MmFlNzYyMTNhODFiZWQwMWJlNTk2NDU2ZGMzNTgxNGZhNTBiZjBhNTg2N2ExZDg2MGIzMDAzYzJjYzNiZSIsImlhdCI6MTY2MjkyODc1Ni43MTY1MTQsIm5iZiI6MTY2MjkyODc1Ni43MTY1MTYsImV4cCI6MTY5NDAzMjc1Ni43MTA4Niwic3ViIjoiIiwic2NvcGVzIjpbInZpZXctdXNlci1wcm9maWxlIiwidmlldy1wcml2YXRlLXJlcG9ydHMiXX0.pn7HO_K0GwtiMkAfBJL74w4NIZE90R_kg670wE6aRpdjDBtqqMRTN3p8nfXAAV8yI0ivUMNSZfsT9jCFs129j-CMc1lMAWYMGlwxoQnPkc8wFJx4mUkTiyYFLGbn5BtCnE4j3DK7lg1w6Obj2H8F9QaRP6inkjX5Z430XQ-rWq3gaPMaT_8e9tKKhIxhGv_i5UiHQ2Ut69-En3nNiZTuf8AucMkR6OuuLS_cQ5zZdqWK1gl3YtF0vim0nWWBoIomVQpbn3c_sv6Gkwt2mxnF1l72qHn8SdEstQlOnm2LQ2csy3CCH2R1jc43KDVfTUc_WQYC62oTWavxF4QqF44x5a-o6_EpKXn4UL9SM8CTD_mZVRo3dRbo8MuExed4dIYg4T1N8JljHL2hcIW4aFhJp2gFT0Gc7QpYKpDu0qMv-3z_5ew4dPml-g3sbQFL-blMDgX_OHfgADicqt6zUbKBLszO6E8Z9KPRTGKMIbnPVUXK9tvesL_mkVbgUQWOxRjxY7cSPIAq-qJdKUi4qItOXCy8sDitUvdGzRnZEIWrdEWefLaoBsQcAsUUBTaDc9kxECbAf6yZEE7xbyBpob8ezK52A4SpsZtumHKl7NyVl3gBEPLpE4oot8H5jLYF8XW4jwKYl7LrmMWJMnXNob-I26Id-VSynK0ZSVUOmmrxaIM"
    const characterInfoString =
      'character(name:"' +
      characterInfoArray[2] +
      '", serverSlug:"' +
      characterInfoArray[1] +
      '", serverRegion:"' +
      characterInfoArray[0] +
      '")';
    const options = {
      method: "POST",
      url: "https://www.warcraftlogs.com/api/v2/client",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + token,
      },
      data: {
        query:
          "{characterData{lfr: " +
          characterInfoString +
          "{overall: zoneRankings(byBracket:false, difficulty: 1)ilvl: zoneRankings(byBracket:true, difficulty: 1)}normal: " +
          characterInfoString +
          "{overall: zoneRankings(byBracket:false, difficulty: 3)ilvl: zoneRankings(byBracket:true, difficulty: 3)}heroic: " +
          characterInfoString +
          "{overall: zoneRankings(byBracket:false, difficulty: 4)ilvl: zoneRankings(byBracket:true, difficulty: 4)}mythic: " +
          characterInfoString +
          "{overall: zoneRankings(byBracket:false, difficulty: 5)ilvl: zoneRankings(byBracket:true, difficulty: 5)}}}",
      },
    };

    return await axios.request(options);
  }

  /**
   * API call to get the relevant information from checkPVP
   * @param {string} urlParams The URL parameters which include the character name, server and region
   */
  static getCheckPVPData(urlParams) {}
}

export default Reader;

function getCharacterInfoArray(url) {
  return url.split("&");
}
