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
import ClassImages from "../Helper/classImages.js";
import WowlogsHelper from "../Helper/wowlogsHelper.js";

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
    difficultyParse.data.map((boss, i) => {
      if (boss.overall !== "-") {
        averageParseOverall =
          averageParseOverall + Number(boss.overall.slice(0, -1));
        averageParseIlvl = averageParseIlvl + Number(boss.ilvl.slice(0, -1));
        bossesKilled = bossesKilled + 1;
      }
      return null;
    });
    return bossesKilled > 0
      ? {
          overall: Math.round(averageParseOverall / bossesKilled) + "%",
          ilvl: Math.round(averageParseIlvl / bossesKilled) + "%",
        }
      : {
          overall: "-",
          ilvl: "-",
        };
  }

  /**
   * Function to handle changes on tier tab clicks
   * @param {Object} event The event of the tab change
   * @param {string} newVal The value of the new tab clicked
   */
  function handleChangeTiers(event, newVal) {
    setDifficulty((Number(newVal) + 1).toString());
    Object.values(props.data.parsedWowlogsData.tableData[role]).map(
      (data, i) => {
        if (i === Number(newVal)) setdifficultyParse(data);
        return null;
      }
    );
  }

  /**
   * Function to handle changes on role tab clicks
   * @param {Object} event The event of the tab change
   * @param {string} newVal The value of the new tab clicked
   */
  function handleChangeRole(event, newVal) {
    setRole(Helper.wowlogsNumbersToRole(Number(newVal)));
    Object.values(
      props.data.parsedWowlogsData.tableData[
        Helper.wowlogsNumbersToRole(Number(newVal))
      ]
    ).map((data, i) => {
      if (i === difficulty - 1) setdifficultyParse(data);
      return null;
    });
  }

  function getAverageParses() {
    const averageParse = findAverageParse();
    return (
      <div>
        {averageParse.overall !== "-" ? (
          <h6>
            <span style={{ color: getColorFromNumber(averageParse.overall) }}>
              {averageParse.overall}
            </span>{" "}
            Average Overall Parse
          </h6>
        ) : (
          <h6>No Average Parse</h6>
        )}
        {averageParse.ilvl !== "-" ? (
          <h6 className="wowlogs-ilvl-average-parse">
            <span style={{ color: getColorFromNumber(averageParse.ilvl) }}>
              {averageParse.ilvl}
            </span>{" "}
            Average Ilvl Parse
          </h6>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }

  function getDifficultyHeaders() {
    return Object.keys(props.data.parsedWowlogsData.tableData[role]).map(
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
            value={Helper.wowlogsTierNamesToNumbers(entry).toString()}
          />
        );
      }
    );
  }

  function getRoleHeaders() {
    return Object.keys(props.data.parsedWowlogsData.tableData).map(
      (roleEntry, i) => {
        if (
          roleEntry === "Tank" &&
          !Helper.getAllTankingClasses().includes(
            props.data.parsedWowlogsData.class
          )
        ) {
          return null;
        }
        return (
          <Tab
            label={
              roleEntry === "Healer"
                ? "Healing"
                : roleEntry === "Tank"
                ? "Tanking"
                : "DPS"
            }
            key={i}
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "white",
              backgroundColor: "rgb(33, 33, 33)",
            }}
            value={Helper.wowlogsRoleToNumbers(roleEntry).toString()}
          />
        );
      }
    );
  }

  function populateTable() {
    return Object.entries(props.data.parsedWowlogsData.tableData[role]).map(
      (entry, i) => {
        return (
          <TabPanel
            key={i}
            value={Helper.wowlogsTierNamesToNumbers(entry[0]).toString()}
          >
            <CustomTable
              headers={[
                "Boss",
                "Overall Parse",
                "Ilvl Parse",
                "Highest " + [role === "Healer" ? "HPS" : "DPS"],
                "Kills",
              ]}
              rows={entry[1].data}
              personalizedCells={(row, index, parentIndex) =>
                createPersonalizedCells(row, index, parentIndex)
              }
            />
          </TabPanel>
        );
      }
    );
  }

  /**
   * Returns the main logic components of the wowlogs section. Seperated for tidiness
   * @returns the main logic components of the wowlogs section
   */
  function returnWowlogsContent() {
    return (
      <div className="wowlogs-section">
        <div className="wowlogs-section-data">
          {Helper.capitalizeFirstLetter(props.data.name)} -{" "}
          {Helper.capitalizeFirstLetter(props.data.server)}
          {getAverageParses()}
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
                borderBottom: "none",
                backgroundColor: "rgb(33, 33, 33)",
              }}
            >
              <TabList
                onChange={(e, v) => handleChangeTiers(e, v)}
                style={{ marginBottom: "none" }}
              >
                {getDifficultyHeaders()}
                <TabContext
                  value={Helper.wowlogsRoleToNumbers(role).toString()}
                >
                  <TabList
                    onChange={(e, v) => handleChangeRole(e, v)}
                    style={{ marginBottom: "none", marginLeft: "auto" }}
                  >
                    {getRoleHeaders()}
                  </TabList>
                </TabContext>
              </TabList>
            </Box>
            {populateTable()}
          </TabContext>
        </div>
      </div>
    );
  }

  function getColorFromNumber(cell) {
    const colors = Object.entries(WowlogsHelper.getWowlogsColors());
    if (cell.toString().indexOf("%")) {
      for (var i = colors.length - 1; i >= 0; i--) {
        if (
          cell.toString().substring(0, cell.toString().indexOf("%")) >=
          Number(colors[i][0])
        ) {
          return colors[i][1];
        }
      }
    }
  }


  /**
   * Create personalized cells for the customTable 
   * @param {Dictionary} row Row dictionary which holds all the cells for a row
   * @param {int} index The index of each cell  
   * @param {int} parentIndex The index of each row 
   * @returns The cells after they have been modified
   */
  function createPersonalizedCells(row, index, parentIndex) {
    const StyledTableCell = TableStyleDefault.styleTableCell();
    let textColor;

    Object.values(row).map((cell, i) => {
      textColor = textColor ? textColor : getColorFromNumber(cell);
      return null;
    });
    const specID =
      props.data.parsedWowlogsData.tableData[role][
        Helper.wowlogsNumbersToTierNames(difficulty - 1)
      ].spec[parentIndex].specID;
    return (
      <StyledTableCell
        key={index}
        align="center"
        style={{
          color: textColor ? textColor : "#b5b5b5",
          border: "2px solid grey",
        }}
      >
        <div className="wowlogs-cell-container">
          {index === 1 && specID ? (
            <div className="wowlogs-spec-container">
              <img
                src={ClassImages.getSpecImages()[specID]}
                alt="Spec"
                className="spec-Image"
              />
            </div>
          ) : (
            <React.Fragment />
          )}

          <div className="wowlogs-cell">{Object.values(row)[index]}</div>
        </div>
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
