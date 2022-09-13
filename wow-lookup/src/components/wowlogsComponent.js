import "../CSS/main.css";
import Helper from "../Helper/helper.js";
import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "./table";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from '@mui/material/Box';


const WowlogsComponent = (props) => {
  let [difficultyParse, setdifficultyParse] = useState(0);
  let [difficulty, setDifficulty] = useState(0);

  /**
   * Function ran whenever the props element is modified which verifies what the current difficultyParse is (Based on page reload and tabs click)
   */
  const choseCorrectdifficultyParse = useCallback(() => {
    if (
      props.data.parsedWowlogsData &&
      props.data.parsedWowlogsData.mainParseDifficulty &&
      props.data.parsedWowlogsData.tableData &&
      props.data.parsedWowlogsData.tableData.lfr
    ) {
      setDifficulty(props.data.parsedWowlogsData.mainParseDifficulty);
      switch (props.data.parsedWowlogsData.mainParseDifficulty) {
        case 0:
          setdifficultyParse(props.data.parsedWowlogsData.tableData.lfr);
          return null;
        case 1:
          setdifficultyParse(props.data.parsedWowlogsData.tableData.normal);
          return null;
        case 2:
          setdifficultyParse(props.data.parsedWowlogsData.tableData.heroic);
          return null;
        case 3:
          setdifficultyParse(props.data.parsedWowlogsData.tableData.mythic);
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
    let averageParse = 0;
    let bossesKilled = 0;
    difficultyParse.map((boss, i) => {
      if(boss.overall !== "-"){
        averageParse = averageParse + Number(boss.overall.slice(0, -1));
        bossesKilled = bossesKilled + 1;
      }
    });
    return bossesKilled > 0 ? Math.round(averageParse / bossesKilled) : "-";
  }

  /**
   * Function to handle changes on tab clicks
   * @param {Object} event The event of the tab change 
   * @param {string} newVal The value of the new tab clicked 
   */
  function handleChange(event, newVal) {
    setDifficulty(newVal);
    Object.entries(props.data.parsedWowlogsData.tableData).map((data, i)=>{
        if(i === Number(newVal))
        setdifficultyParse(data[1])
    })
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
          <h6>{averageParse !== "-" ? averageParse + "% Average Parse": "No Average Parse"}</h6>
          {/* To string because tablist values are only strings */}
          <TabContext value={difficulty.toString()}>
          <Box className="multi-button-tab" sx={{ border: 3, borderColor: 'gray', borderBottom: 0, backgroundColor:"rgb(33, 33, 33)"}}>
            <TabList onChange={(e, v) => handleChange(e, v)}>
              {Object.entries(props.data.parsedWowlogsData.tableData).map(
                (entry, i) => {
                  return (
                    <Tab
                      label={entry[0]}
                      key={i}
                      sx={{ fontSize: "18px", fontWeight:"bold", color:"white"}}
                      value={Helper.wowlogsTierNamesToNumbers(
                        entry[0]
                      ).toString()}
                    />
                  );
                }
              )}
            </TabList>
            </Box>
            {Object.entries(props.data.parsedWowlogsData.tableData).map(
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

  return (
    <div className="wowlogs-section">
      {props.data.parsedWowlogsData.tableData &&
      props.data.parsedWowlogsData.tableData.lfr &&
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