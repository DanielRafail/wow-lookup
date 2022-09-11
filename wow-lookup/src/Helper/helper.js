import "../CSS/main.css";
import React from "react";

/**
 * A healper class with some static functions to limit repetition
 */
class Helper extends React.Component {
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
}

export default Helper;
