import "../CSS/main.css";
import Helper from "../Helper/helper.js";
import React from "react";
import CustomTable from "./table";
import TableStyleDefault from "../Helper/tableStyleDefault.js";

const RaiderioComponent = (props) => {
  /**
   * Function which returns the best keys you have run this season
   * @returns The best keys you have run this season
   */
  function returnRaiderIOBestKeys(headers) {
    const roles = ["DPS", "Tank", "Healer"];
    return (
      <div className="best-keys">
        <h4 style={{ marginBottom: "0px" }}>
          {props.data.name} - {Helper.capitalizeFirstLetter(props.data.server)}{" "}
          (
          <span
            style={{
              color: getRaiderIOScoreColor(
                props.data.parsedRaiderIOData.score.all
              ),
            }}
          >
            {props.data.parsedRaiderIOData.score.all} IO
          </span>
          )
        </h4>
        <h6 style={{ marginTop: "20px" }}>
          {roles.map((role, i) => {
            return (
              <span key={i}>
                {role}(
                <span
                  style={{
                    color: getRaiderIOScoreColor(
                      props.data.parsedRaiderIOData.score[role.toLowerCase()]
                    ),
                  }}
                >
                  {props.data.parsedRaiderIOData.score[role.toLowerCase()]} IO
                </span>
                ){" "}
              </span>
            );
          })}
        </h6>
        <CustomTable
          headers={headers}
          rows={props.data.parsedRaiderIOData.keys}
          personalizedCells={(row, index) =>
            createPersonalizedCells(row, index)
          }
        />
      </div>
    );
  }

  function compareKeys(keyOne, keyTwo) {
    if (
      keyOne.substring(keyOne.lastIndexOf("+")) ===
      keyTwo.substring(keyOne.lastIndexOf("+"))
    ) {
      return (
        (keyOne.match(/[+]/g) || []).length >
        (keyTwo.match(/[+]/g) || []).length
      );
    } else {
      const keyOneNumber =
        keyOne.lastIndexOf("+") !== -1
          ? keyOne.substring(keyOne.lastIndexOf("+") + 1)
          : keyOne;
      const keyTwoNumber =
        keyTwo.lastIndexOf("+") !== -1
          ? keyTwo.substring(keyTwo.lastIndexOf("+") + 1)
          : keyTwo;
      return keyOneNumber > keyTwoNumber;
    }
  }

  function createPersonalizedCells(row, index) {
    const StyledTableCell = TableStyleDefault.styleTableCell();
    let className = "";
    const rowKeys = Object.keys(row);
    let biggestDungeonKey = "+";
    for (var i = 0; i < rowKeys.length; i++) {
      if (rowKeys[i] === "fortified" || rowKeys[i] === "tyrannical") {
        biggestDungeonKey = compareKeys(row[rowKeys[i]], biggestDungeonKey)
          ? row[rowKeys[i]]
          : biggestDungeonKey;
      }
    }
    if (
      (rowKeys[index] === "fortified" || rowKeys[index] === "tyrannical") &&
      row[rowKeys[index]] === biggestDungeonKey
    ) {
      className = "underline veryBold";
    }
    return (
      <StyledTableCell key={index} align="center" className={className}>
        {row[rowKeys[index]]}
      </StyledTableCell>
    );
  }

  /**
   * Return the color for a raider io score
   * @param {int} roleScore The score associated with a role
   * @returns the color associated with that score
   */
  function getRaiderIOScoreColor(roleScore) {
    for (var i = 0; i < props.data.parsedRaiderIOData.scoreColors.length; i++) {
      if (roleScore >= props.data.parsedRaiderIOData.scoreColors[i].score) {
        return props.data.parsedRaiderIOData.scoreColors[i].rgbHex;
      }
    }
  }

  /**
   * Verify if props are valid
   * @returns If props are valid
   */
  function verifyProps() {
    return (
      props.data &&
      props.data.parsedRaiderIOData &&
      props.data.parsedRaiderIOData.keys &&
      props.data.parsedRaiderIOData.keys.length !== 0
    );
  }

  /**
   * Function which returns the most recent keys you have run this season (number of keys equivalent to the number of dungeons this season)
   * @returns The most recents keys you have run this season
   */
  function returnRaiderIORecentKeys(headers) {
    return (
      <div className="recent-keys">
        <h6 className="hidden">.</h6>
        <h4>Most Recent Runs</h4>
        <CustomTable
          headers={headers}
          rows={props.data.parsedRaiderIOData.recentRuns}
        />
      </div>
    );
  }
  function createEmptyTableArray(allDungeons) {
    let returnArray = [];
    if (allDungeons) {
      allDungeons.map((dungeon, i) => {
        returnArray.push({
          dungeon: dungeon.name,
          tyrannical: "-",
          fortified: "-",
        });
      });
    }
    return returnArray;
  }
  return (
    <div className="raiderIO-section">
      {verifyProps() ? (
        returnRaiderIOBestKeys(["Dungeons", "Fortified", "Tyrannical"])
      ) : props.data && props.data.raiderIOError ? (
        <p className="error-p">Error loading Raider.IO info</p>
      ) : (
        <CustomTable
          headers={["Dungeons", "Fortified", "Tyrannical"]}
          rows={createEmptyTableArray(
            props.data.parsedRaiderIOData.allDungeons
          )}
        />
      )}
      <div className="flex-seperator"></div>
      {verifyProps() ? (
        returnRaiderIORecentKeys(["Dungeons", "Keys", "Date"])
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default RaiderioComponent;
