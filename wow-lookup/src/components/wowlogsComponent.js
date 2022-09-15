import "../CSS/main.css";
import Helper from "../Helper/helper.js";
import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "./table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import TableStyleDefault from "../Helper/tableStyleDefault.js";

const WowlogsComponent = (props) => {
  let [difficultyParse, setdifficultyParse] = useState(0);
  let [difficulty, setDifficulty] = useState(0);
  let [role, setRole] = useState(0);

  /**
   * Function ran whenever the props element is modified which verifies what the current difficultyParse is (Based on page reload and tabs click)
   */
  const choseCorrectdifficultyParse = useCallback(() => {
    if (
      props.data.parsedWowlogsData &&
      props.data.parsedWowlogsData.mainParseDifficulty &&
      props.data.parsedWowlogsData.tableData &&
      props.data.parsedWowlogsData.tableData.DPS &&
      props.data.parsedWowlogsData.tableData.DPS.lfr
    ) {
      setDifficulty(props.data.parsedWowlogsData.mainParseDifficulty);
      setRole("DPS");
      switch (props.data.parsedWowlogsData.mainParseDifficulty) {
        case 1:
          setdifficultyParse(props.data.parsedWowlogsData.tableData.DPS.lfr);
          return null;
        case 2:
          setdifficultyParse(props.data.parsedWowlogsData.tableData.DPS.normal);
          return null;
        case 3:
          setdifficultyParse(props.data.parsedWowlogsData.tableData.DPS.heroic);
          return null;
        case 4:
          setdifficultyParse(props.data.parsedWowlogsData.tableData.DPS.mythic);
          return null;
        default:
          return null;
      }
    } else return null;
  }, [props.data.parsedWowlogsData]);

  useEffect(() => {
    choseCorrectdifficultyParse();
  }, [choseCorrectdifficultyParse]);

  /**
   * Function which goes through all the parses of your chosen difficultyParse and displays your average parses between all bosses
   * @returns The average parses between all bosses
   */
  function findAverageParse() {
    let averageParseOverall = 0;
    let averageParseIlvl = 0;
    let bossesKilled = 0;
    difficultyParse.map((boss, i) => {
      if (boss.overall !== "-") {
        averageParseOverall =
          averageParseOverall + Number(boss.overall.slice(0, -1));
        averageParseIlvl = averageParseIlvl + Number(boss.ilvl.slice(0, -1));
        bossesKilled = bossesKilled + 1;
      }
    });
    return bossesKilled > 0
      ? {
          overall: Math.round(averageParseOverall / bossesKilled),
          ilvl: Math.round(averageParseIlvl / bossesKilled),
        }
      : "-";
  }

  /**
   * Function to handle changes on tab clicks
   * @param {Object} event The event of the tab change
   * @param {string} newVal The value of the new tab clicked
   */
  function handleChange(event, newVal) {
    setDifficulty(newVal);
    Object.values(props.data.parsedWowlogsData.tableData.DPS).map((data, i) => {
      if (i === Number(newVal)) setdifficultyParse(data);
    });
  }

  /**
   * Returns the main logic components of the wowlogs section. Seperated for tidiness
   * @returns the main logic components of the wowlogs section
   */
  function returnWowlogsContent() {
    const averageParse = findAverageParse();
    return (
      <div className="wowlogs-section">
        <div className="wowlogs-section-data">
          {props.data.name} - {Helper.capitalizeFirstLetter(props.data.server)}
          <h6>
            {averageParse.overall !== "-"
              ? averageParse.overall + "% Average Overall Parse"
              : "No Average Parse"}
          </h6>
          {averageParse.ilvl !== "-" ? (
            <h6 className="wowlogs-ilvl-average-parse">
              {averageParse.ilvl}% Average Ilvl Parse
            </h6>
          ) : (
            <React.Fragment />
          )}
          {/* To string because tablist values are only strings 
           /* difficulty -1 here because parser brings back with indexes starting at 1, else 
           /* someone without any parses wouldn't have any tables because difficulty
           /* woulda been at 0 and therefore considered "undeclared" or "undefined" or whatever
           /* and none of the table would have appeared
          */}
          <TabContext value={(difficulty - 1).toString()}>
            <Box
              className="multi-button-tab"
              sx={{
                border: "2px solid gray",
                borderBottom:"none",
                backgroundColor: "rgb(33, 33, 33)",
              }}
            >
              <TabList onChange={(e, v) => handleChange(e, v)} style={{marginBottom:"none"}}>
                {Object.keys(props.data.parsedWowlogsData.tableData[role]).map(
                  (entry, i) => {
                    return (
                      <Tab
                        label={entry}
                        key={i}
                        sx={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "white",
                        }}
                        value={Helper.wowlogsTierNamesToNumbers(
                          entry
                        ).toString()}
                      />
                    );
                  }
                )}
                {Object.keys(props.data.parsedWowlogsData.tableData).map(
                  (roleEntry, i) => {
                    return (
                      <Tab
                        label={roleEntry}
                        key={i}
                        sx={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "white",
                          backgroundColor: "rgb(33, 33, 33)",
                          ...(roleEntry === "DPS" && {
                            marginLeft: "auto",
                          }),
                        }}
                        value={Helper.wowlogsRoleToNumbers(role) + 4}
                      />
                    );
                  }
                )}
              </TabList>
            </Box>
            {Object.entries(props.data.parsedWowlogsData.tableData[role]).map(
              (entry, i) => {
                return (
                  <TabPanel
                    key={i}
                    value={Helper.wowlogsTierNamesToNumbers(
                      entry[0]
                    ).toString()}
                  >
                    <CustomTable
                      headers={[
                        "Boss",
                        "Overall Parse",
                        "Ilvl Parse",
                        "Highest DPS",
                        "Kills",
                      ]}
                      rows={entry[1]}
                      personalizedCells={(row, index) =>
                        createPersonalizedCells(row, index)
                      }
                    />
                  </TabPanel>
                );
              }
            )}
          </TabContext>
        </div>
      </div>
    );
  }

  function createPersonalizedCells(row, index) {
    const StyledTableCell = TableStyleDefault.styleTableCell();
    const colors = {
      100: "#dcb900",
      99: "#d2a9b0",
      95: "#ffa500ba",
      75: "purple",
      50: "rgb(57 105 184)",
      25: "rgb(37 147 37)",
    };
    let textColor = "";
    Object.values(row).map((cell, i) => {
      if (cell.toString().indexOf("%")) {
        Object.entries(colors).map((color, i) => {
          if (
            cell.toString().substring(0, cell.toString().indexOf("%")) >=
            Number(color[0])
          ) {
            textColor = color[1];
          }
        });
      }
    });
    return (
      <StyledTableCell
        key={index}
        align="center"
        style={{
          color: textColor ? textColor : "#b5b5b5",
          border: "2px solid grey",
        }}
      >
        {Object.values(row)[index]}
      </StyledTableCell>
    );
  }

  return (
    <div className="wowlogs-section">
      {props.data.parsedWowlogsData.tableData &&
      props.data.parsedWowlogsData.tableData.DPS &&
      difficultyParse ? (
        returnWowlogsContent()
      ) : props.data && props.data.wowlogsError ? (
        <p className="error-p">Error loading WarcraftLogs info</p>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default WowlogsComponent;
