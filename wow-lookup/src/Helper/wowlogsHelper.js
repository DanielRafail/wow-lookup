
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
      100: "#e5cc80",
      99: "#f48cba",
      95: "#ff8000",
      75: "#a335ee",
      50: "#0070dd",
      25: "#1eff00",
    };
  
  }
}
export default WowlogsHelper;

