import "../CSS/main.css";
import axios from "axios";
import React from "react";
import Helper from "../Helper/helper.js";

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
    const raiderIOScores = await axios.get(
      "https://raider.io/api/v1/characters/profile",
      {
        params: {
          region: characterInfoArray[0],
          realm: characterInfoArray[1],
          name: characterInfoArray[2],
          fields:
            "mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs:all,mythic_plus_alternate_runs:all",
        },
      }
    );
    const allDungeons = await axios.get(
      "https://raider.io/api/v1/mythic-plus/static-data?expansion_id=" +
        (Object.keys(Helper.getAllSeasons()).length - 2)
    );
    const scoreColors = await axios.get(
      "https://raider.io/api/v1/mythic-plus/score-tiers"
    );
    return {
      raiderIOScores: raiderIOScores,
      allDungeons: Object.values(allDungeons.data.seasons)[0].dungeons,
      scoreColors: scoreColors,
    };
  }

  /**
   * API call to get the relevant information from wowlogs
   * @param {string} urlParams The URL parameters which include the character name, server and region
   */
  static async getWowlogsData(urlParams) {
    const characterInfoArray = getCharacterInfoArray(urlParams);
    const token =
      "";
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
        Authorization: "Bearer " + token,
      },
      data: {
        query:
          "{characterData{lfr: " +
          characterInfoString +
          "{overallDPS: zoneRankings(byBracket:false, difficulty: 1, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 1, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 1, metric:hps)ilvlHPS: zoneRankings(byBracket:false, difficulty: 1, metric:hps)}normal: " +
          characterInfoString +
          "{overallDPS: zoneRankings(byBracket:false, difficulty: 3, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 3, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 3, metric:hps)ilvlHPS: zoneRankings(byBracket:false, difficulty: 3, metric:hps)}heroic: " +
          characterInfoString +
          "{overallDPS: zoneRankings(byBracket:false, difficulty: 4, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 4, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 4, metric:hps)ilvlHPS: zoneRankings(byBracket:false, difficulty: 4, metric:hps)}mythic: " +
          characterInfoString +
          "{overallDPS: zoneRankings(byBracket:false, difficulty: 5, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 5, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 5, metric:hps)ilvlHPS: zoneRankings(byBracket:false, difficulty: 5, metric:hps)}}}",
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
    const name = characterInfoArray[2].toLowerCase();
    const server = characterInfoArray[1].toLowerCase();
    let token = "";
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    let twoRating =
      "https://" +
      characterInfoArray[0] +
      ".api.blizzard.com/profile/wow/character/" +
      server +
      "/" +
      name +
      "/pvp-bracket/2v2?namespace=profile-" +
      characterInfoArray[0] +
      "&locale=en_US&access_token=" +
      token;
    let threeRating =
      "https://" +
      characterInfoArray[0] +
      ".api.blizzard.com/profile/wow/character/" +
      server +
      "/" +
      name +
      "/pvp-bracket/3v3?namespace=profile-" +
      characterInfoArray[0] +
      "&locale=en_US&access_token=" +
      token;
    let allAchievs =
      "https://" +
      characterInfoArray[0] +
      ".api.blizzard.com/profile/wow/character/" +
      server +
      "/" +
      name +
      "/achievements?namespace=profile-" +
      characterInfoArray[0] +
      "&locale=en_US&access_token=" +
      token;
    const achievsAnswer = await axios.get(allAchievs, headers);
    const twoRatingAnswer = await axios.get(twoRating, headers);
    const threeRatingAnswer = await axios.get(threeRating, headers);
    return {
      achievements: achievsAnswer,
      two: twoRatingAnswer,
      three: threeRatingAnswer,
    };
  }
}

export default Reader;
/**
 * Split a string based on the & character
 * @param {*} url the string to be split
 * @returns an array with the string split
 */
function getCharacterInfoArray(url) {
  return url.split("&");
}
