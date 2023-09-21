import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import LinkTab from "./linktab";
import HomeIcon from "@mui/icons-material/Home";

interface Props {
  navigationTabValue: number;
  HandleChange: Function;
  headers: string[];
  homeButton: boolean;
}

/**
 * Navigation bar component with headers. Modify if need different navigation id
 */
const Navigation = (props: Props) => {
  return (
    <nav id="navigation-header">
      <Paper>
        <Tabs
          TabIndicatorProps={{
            style: {
              animation: "none",
            },
          }}
          allowScrollButtonsMobile
          scrollButtons="auto"
          variant="scrollable"
          value={props.navigationTabValue}
          onChange={(e, v) => props.HandleChange(e, v)}
        >
          {props.homeButton && (
            <Tab
              className="home-button-section nav_tab"
              label="WoW-Lookup"
              icon={<HomeIcon />}
              iconPosition="start"
              key={-1}
              value={-1}
            />
          )}
          {props.headers &&
            props.headers.map((header: string, i: number) => {
              return <LinkTab label={header} value={i} key={i} />;
            })}
        </Tabs>
      </Paper>
    </nav>
  );
};

export default Navigation;
