import "../CSS/main.css";
import React from "react";

/**
 * A healper class with some static functions to limit repetition
 */
class Helper extends React.Component {
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export default Helper;
