import React from "react";
import Tab from "@mui/material/Tab";

/**
 * Single Tab elements with the general className and ...this.props to handle all props elements
 */

interface Props {
  label: string;
  value: number;
  key: number;
}
const LinkTab = (props: Props) => {
  return <Tab disableRipple={true} className="nav_tab" {...props} />;
};

export default LinkTab;
