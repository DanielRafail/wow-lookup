import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import LinkTab from "./linktab.js";
import HomeIcon from "@mui/icons-material/Home";
/**
 * Navigation bar component with headers. Modify if need different navigation id
 * * @param {int} navigation_tab_value value the tabs will use
 * * @param {boolean} homeButton boolean to verify if to add menu button
 * * @param {function} HandleChange function to handle the tabs click
 * * @param {array} headers string array with the name of the headers
 */
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
            value={this.props.navigationTabValue}
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
            {this.props.headers ? (
              this.props.headers.map((header, i) => {
                return <LinkTab label={header} value={i} key={i} />;
              })
            ) : (
              <React.Fragment />
            )}
          </Tabs>
        </Paper>
      </nav>
    );
  }
}

export default Navigation;
