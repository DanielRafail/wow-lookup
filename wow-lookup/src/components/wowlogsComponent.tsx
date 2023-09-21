import "../CSS/main.css";
import Helper from "../Helper/helper";
import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "./table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import TableStyleDefault from "../CSS/tableStyleDefault";
import ClassImages from "../Helper/classImages";
import WowlogsHelper from "../Helper/wowlogsHelper";
import {
  RoleUpper,
  iParse,
  iparsedWowlogsData,
  difficulties,
} from "../interfaces/lookup/interface";

interface Props {
  data: {
    name: string;
    server: string;
    parsedWowlogsData: iparsedWowlogsData;
  };
}

const WowlogsComponent = (props: Props) => {
  let [difficultyParse, setdifficultyParse] = useState<iParse>();
  let [difficulty, setDifficulty] = useState(0);
  let [role, setRole] = useState<RoleUpper>("DPS");

  /**
   * Function ran whenever the props element is modified which verifies what the current difficultyParse is (Based on page reload and tabs click)
   */
  const choseCorrectdifficultyParse = useCallback(() => {
    const parsedWowlogsData = props.data.parsedWowlogsData;
    if (
      parsedWowlogsData &&
      parsedWowlogsData.tableData &&
      parsedWowlogsData.tableData.DPS &&
      parsedWowlogsData.tableData.DPS.lfr
    ) {
      setDifficulty(
        parsedWowlogsData.highestDifficulty
          ? parsedWowlogsData.highestDifficulty
          : 1
      );
      const currentRole: RoleUpper = Object.values(
        parsedWowlogsData.mainParsePerDifficulty
      )[parsedWowlogsData.highestDifficulty - 1];
      setRole(currentRole ? currentRole : "DPS");
      switch (props.data.parsedWowlogsData.highestDifficulty) {
        case 1:
          setdifficultyParse(parsedWowlogsData.tableData[currentRole].lfr);
          return null;
        case 2:
          setdifficultyParse(parsedWowlogsData.tableData[currentRole].normal);
          return null;
        case 3:
          setdifficultyParse(parsedWowlogsData.tableData[currentRole].heroic);
          return null;
        case 4:
          setdifficultyParse(parsedWowlogsData.tableData[currentRole].mythic);
          return null;
        default:
          setdifficultyParse(parsedWowlogsData.tableData.DPS.lfr);
          return null;
      }
    } else return null;
  }, [setdifficultyParse, props.data.parsedWowlogsData]);

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
    difficultyParse!.data.map((boss, i) => {
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
  function handleChangeTiers(event: React.SyntheticEvent, newVal: number) {
    let newBestParsingSpec = Object.values(
      props.data.parsedWowlogsData.mainParsePerDifficulty
    )[Number(newVal)] as RoleUpper;
    setDifficulty(Number(newVal) + 1);
    if (newBestParsingSpec) setRole(newBestParsingSpec);
    else newBestParsingSpec = role;
    Object.values(
      props.data.parsedWowlogsData.tableData[newBestParsingSpec]
    ).map((data, i) => {
      if (i === Number(newVal)) setdifficultyParse(data);
      return null;
    });
  }

  /**
   * Function to handle changes on role tab clicks
   * @param {React.SyntheticEvent} event The event of the tab change
   * @param {number} newVal The value of the new tab clicked
   */
  function handleChangeRole(event: React.SyntheticEvent, newVal: number) {
    setRole(Helper.wowlogsNumbersToRole(newVal) as RoleUpper);
    Object.values(
      props.data.parsedWowlogsData.tableData[
        Helper.wowlogsNumbersToRole(newVal) as RoleUpper
      ]
    ).map((data, i) => {
      if (i === difficulty - 1) setdifficultyParse(data as iParse);
      return null;
    });
  }

  /**
   * Get average parses on a difficulty and spec
   * @returns The average parses on that difficulty and spec
   */
  function getAverageParses() {
    const averageParse = findAverageParse();
    return (
      <div>
        {averageParse.overall !== "-" ? (
          <h5>
            <span style={{ color: getColorFromNumber(averageParse.overall) }}>
              {averageParse.overall}
            </span>{" "}
            Average Overall Parse
          </h5>
        ) : (
          <h5>No Average Parse</h5>
        )}
        {averageParse.ilvl !== "-" && (
          <h5 className="wowlogs-ilvl-average-parse">
            <span style={{ color: getColorFromNumber(averageParse.ilvl) }}>
              {averageParse.ilvl}
            </span>{" "}
            Average Ilvl Parse
          </h5>
        )}
      </div>
    );
  }

  /**
   * Sets the difficulty headers for the custom Table
   * @returns MUI tab elements with the difficulty headers
   */
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

  /**
   * Sets the role headers for the custom Table
   * @returns MUI tab elements with the role headers
   */
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
        } else if (
          roleEntry === "Healer" &&
          !Helper.getAllHealingClasses().includes(
            props.data.parsedWowlogsData.class
          )
        ) {
          return null;
        } else
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

  /**
   * Populate the table with API data
   * @returns the table after it has been populated
   */
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
              personalizedCells={(
                row: iParse["data"][0],
                index: number,
                parentIndex: number
              ) => createPersonalizedCells(row, index, parentIndex)}
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
          <div className="wowlogs-section-data-text">
            <h3>
              {Helper.capitalizeFirstLetter(props.data.name)} -{" "}
              {Helper.capitalizeFirstLetter(props.data.server)}
            </h3>
            {getAverageParses()}
          </div>

          {/* To string because tablist values are only strings 
           /* difficulty -1 here because parser brings back with indexes starting at 1, else 
           /* someone without any parses wouldn't have any tables for LFR because difficulty
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

  /**
   * Get the color associated with the parse done
   * @param {string} cell the content of the cell
   * @returns the color associated with the parse on that cell's content
   */
  function getColorFromNumber(cell: string): string {
    const colors = Object.entries(WowlogsHelper.getWowlogsColors());
    if (cell.indexOf("%")) {
      for (var i = colors.length - 1; i >= 0; i--) {
        if (
          Number(cell.substring(0, cell.indexOf("%"))) >= Number(colors[i][0])
        ) {
          return colors[i][1];
        }
      }
    }
    return "";
  }

  /**
   * Create personalized cells for the customTable
   * @param {Dictionary} row Row dictionary which holds all the cells for a row
   * @param {number} index The index of each cell
   * @param {number} parentIndex The index of each row
   * @returns The cells after they have been modified
   */
  function createPersonalizedCells(
    row: iParse["data"][0],
    index: number,
    parentIndex: number
  ) {
    const StyledTableCell = TableStyleDefault.styleTableCell();
    let textColor = "";
    Object.values(row).forEach((cell, i) => {
      Object.values(cell);
      textColor = textColor ? textColor : cell ? getColorFromNumber(cell) : "#b5b5b5";
      return null;
    });
    const specID =
      props.data.parsedWowlogsData.tableData[role][
        Helper.wowlogsNumbersToTierNames(difficulty - 1) as difficulties
      ].spec[parentIndex].specID;
    return (
      <StyledTableCell
        key={index}
        align="center"
        style={{
          color: textColor,
          border: "2px solid grey",
        }}
      >
        <div className="wowlogs-cell-container">
          {index === 1 && specID && Number(row.killCount) > 0 && (
            <div className="wowlogs-spec-container">
              <img
                src={ClassImages.getSpecImages()[specID]}
                alt="Spec"
                className="spec-Image"
              />
            </div>
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
      ) : props.data.parsedWowlogsData.status &&
        props.data.parsedWowlogsData.status === 429 ? (
        <p className="error-p">
          Please try again later
          <br /> Warcraft logs timed out the website out for requesting
          information too often
        </p>
      ) : props.data.parsedWowlogsData.status &&
        props.data.parsedWowlogsData.status === 404 ? (
        <p className="error-p">
          Character could not be found, make sure they exist and have completed
          content
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WowlogsComponent;
