import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import LinkTab from "./linktab.js";
import HomeIcon from "@mui/icons-material/Home";

class Navigation extends React.Component {
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
            onChange={(e, v) => this.props.HandleChange(e, v)}
            centered
          >
            {this.props.homeButton ? (
              <Tab
                className="home-button-section"
                label="WoW-Lookup"
                icon={<HomeIcon />}
                iconPosition="start"
                key={-1}
                value={-1}
              />
            ) : (
              <React.Fragment />
            )}
            {this.props.headers ? this.props.headers.map((header, i) => {
              return <LinkTab label={header} value={i} key={i}/>
            }): <React.Fragment/>}
          </Tabs>
        </Paper>
      </nav>
    );
  }
}

export default Navigation;
