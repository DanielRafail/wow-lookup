import React from "react";
import Tab from "@mui/material/Tab";

/**
 * Single Tab elements with the general className and ...this.props to handle all props elements
 */
const LinkTab = (props) => {
  return <Tab disableRipple={true} className="nav_tab" {...props} />;
};

export default LinkTab;
