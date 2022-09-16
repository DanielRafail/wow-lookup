
import "../CSS/main.css";
import React from "react";

/**
 * A healper class with some static functions to limit repetition
 */
class WowlogsHelper extends React.Component {

  /**
   * Get all colors for every parsing bracket
   * @returns color for every parsing bracket
   */
  static getWowlogsColors() {
    return  {
      100: "#dcb900",
      99: "#d2a9b0",
      95: "#ffa500ba",
      75: "purple",
      50: "rgb(57 105 184)",
      25: "rgb(37 147 37)",
    };
  
  }
}
export default WowlogsHelper;

