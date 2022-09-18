import "../CSS/main.css";
import React from "react";

/**
 * A helper class with some static functions to limit repetition
 */
class Helper extends React.Component {
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Function to translate the tier name to its difficulty number
   * @param {string} name the tier name
   * @returns the difficulty number
   */
  static wowlogsTierNamesToNumbers(name) {
    switch (name) {
      case "lfr":
        return 0;
      case "normal":
        return 1;
      case "heroic":
        return 2;
      case "mythic":
        return 3;
      default:
        return null;
    }
  }

  /**
   * Function to translate the role name to its role number
   * The return values are high so that they do not overlap with the tier values and cause
   * irregularities in the table
   * @param {string} name the role name
   * @returns the role number
   */
  static wowlogsRoleToNumbers(name) {
    switch (name) {
      case "DPS":
        return 10;
      case "Healer":
        return 11;
      case "Tank":
        return 12;
      default:
        return null;
    }
  }

  /**
   * Function to translate the difficulty number to its tier name
   * @param {string} name the difficulty number
   * @returns the tier name
   */
  static wowlogsNumbersToTierNames(name) {
    switch (name) {
      case 0:
        return "lfr";
      case 1:
        return "normal";
      case 2:
        return "heroic";
      case 3:
        return "mythic";
      default:
        return null;
    }
  }

  /**
   * Function to translate the role number to its name
   * The return values are high so that they do not overlap with the tier values and cause
   * irregularities in the table
   * @param {string} name the role number
   * @returns the name
   */
  static wowlogsNumbersToRole(role) {
    switch (role) {
      case 10:
        return "DPS";
      case 11:
        return "Healer";
      case 12:
        return "Tank";
      default:
        return null;
    }
  }

  /**
   * Function which returns an array of all classes that can tank
   * @returns All classes that can tank
   */
  static getAllTankingClasses() {
    return [
      "Warrior",
      "Monk",
      "Death Knight",
      "Paladin",
      "Demon Hunter",
      "Druid",
    ];
  }

  /**
   * Get the position of a value within a String after a certain amount of repetitions
   * @param {string} string the String we will use
   * @param {string} subString the substring we are looking for
   * @param {int} index after how many repititons we get the position
   * @returns position of the substring after an index amount of repitions
   */
  static getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  /**
   * Get the substring within a startindex and endIndex
   * @param {string} string the string we will get the substring of
   * @param {int} startIndex the start index for getting the substring
   * @param {int} endIndex  the end index for getting the substring
   * @returns substring within a startindex and endindex
   */
  static getSubstring(string, startIndex, endIndex) {
    // + 1 to remove the /
    const sIndex = Helper.getPosition(string, "/", startIndex) + 1;
    const eIndex = Helper.getPosition(string, "/", endIndex);
    const returnvalue = string.substring(sIndex, eIndex);
    return returnvalue;
  }

  /**
   * Hard code method which returns a dictionary with key all of WoW's expansions and values an incrementing ID. Have to manually hard code it because Blizzard API returns it in a falsy order. Maybe use other API call and compare based on ID?
   * @returns Dictionary object with keys = WoW expansions and values = incrementing ID
   */
  static getAllSeasons() {
    let everySeasons = [
      "Classic",
      "Burning Crusade",
      "Wrath of the Lich King",
      "Cataclysm",
      "Mists of Pandaria",
      "Warlords of Draenor",
      "Legion",
      "Battle for Azeroth",
      "Shadowlands",
      "Dragonflight",
    ];
    let everySeasonsWithId = {};
    everySeasons.map((everySeason, i) => {
      everySeasonsWithId[everySeason] = i;
      return null;
    });
    return everySeasonsWithId;
  }
}

export default Helper;
