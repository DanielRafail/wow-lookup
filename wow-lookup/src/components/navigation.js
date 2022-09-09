import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import LinkTab from "./linktab.js";
import HomeIcon from "@mui/icons-material/Home";

class Navigation extends React.Component {

  /**
   * Function to handle changing tabs on the navigation menu
   */
  HandleChange = (event, v) => {
    // Set the navigation tab back to 0 as it is the default and only interactive page, will leave this here in case I decide to create personalized pages for each website in the future
    this.props.set_navigation_tab_value(0);
    //verify which tab we are on and select the link based on it (or send back to index)
    const correctPage = this.VerifyTab(v);
    if (correctPage === -1) {
      this.props.navigate("/");}
      else if (correctPage !== null){
      window.open(correctPage, "_blank", "noopener,noreferrer");
    }
  };

  /**
   * 
   * @param {int} index Verify which tab we are on and select the appropriate website
   * @returns the appropriate website URL
   */
  VerifyTab(index) {
    const characterInfo = this.props.characterInfo.replaceAll("&", "/");
    switch (index) {
      case 0:
        return null;
      case 1:
        return "https://www.warcraftlogs.com/character/" + characterInfo;
      case 2:
        return "https://raider.io/characters/" + characterInfo;
      case 3:
        return "https://check-pvp.fr/" + characterInfo;
      case -1:
        return -1;
      default:
        return null;
    }
  }

  render() {
    return (
      <nav id="navigation-header">
        <Paper>
          <Tabs
            TabIndicatorProps={{
              style: {
                animation: "none",
              },
            }}
            value={this.props.navigation_tab_value}
            onChange={(e, v) => this.HandleChange(e, v)}
            centered
          >
            <Tab
              className="home-button-section"
              label="WoW-Lookup"
              icon={<HomeIcon />}
              iconPosition="start"
              value={-1}
            />
            <LinkTab label="Summary" value={0} />
            <LinkTab label="WoWlogs" value={1} />
            <LinkTab label="Raider.IO" value={2} />
            <LinkTab label="CheckPVP" value={3} />
          </Tabs>
        </Paper>
      </nav>
    );
  }
}

export default Navigation;
