import "../CSS/main.css";
import Helper from "../Helper/helper.js";
import React from "react";
import CustomTable from "./table";
import TableStyleDefault from "../CSS/tableStyleDefault.js";
import StarRateIcon from "@mui/icons-material/StarRate";

const RaiderioComponent = (props) => {
  /**
   * Function which returns the best keys you have run this season
   * @returns The best keys you have run this season
   */
  function returnRaiderIOBestKeys(headers) {
    const roles = ["DPS", "Tank", "Healer"];
    return (
      <div className="best-keys">
        <div className="best-keys-headers">
          <h3 style={{ marginBottom: "0px" }}>
            {Helper.capitalizeFirstLetter(props.data.name)} -{" "}
            {Helper.capitalizeFirstLetter(props.data.server)} (
            <span
              style={{
                color: getRaiderIOScoreColor(
                  props.data.parsedRaiderIOData.raiderIO.score.all
                ),
              }}
            >
              {props.data.parsedRaiderIOData.raiderIO.score.all} IO
            </span>
            )
          </h3>
          <h5 style={{ marginTop: "20px" }}>
            {roles.map((role, i) => {
              return (
                <span key={i}>
                  {role}(
                  <span
                    style={{
                      color: getRaiderIOScoreColor(
                        props.data.parsedRaiderIOData.raiderIO.score[role.toLowerCase()]
                      ),
                    }}
                  >
                    {props.data.parsedRaiderIOData.raiderIO.score[role.toLowerCase()]} IO
                  </span>
                  ){" "}
                </span>
              );
            })}
          </h5>
        </div>

        <CustomTable
          headers={headers}
          rows={props.data.parsedRaiderIOData.raiderIO.keys}
          personalizedCells={(row, index) =>
            createPersonalizedCells(row, index)
          }
        />
      </div>
    );
  }

  /**
   * Compare m+ keys and see which one is the biggest
   * @param {string} keyOne the first M+ key level
   * @param {string} keyTwo the second M+ key level
   * @returns string containing the highest key
   */
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

  /**
   * Create personalized cells for the CustomTable
   * @param {Object} row Dictionary holding all the elements of the row we are on
   * @param {int} index int representing which row we are on
   * @returns The personalized cells for said row
   */
  function createPersonalizedCells(row, index) {
    const StyledTableCell = TableStyleDefault.styleTableCell();
    let className = "";
    const rowKeys = Object.keys(row);
    let biggestDungeonKey = "";
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
    let rowAsArray = [...row[rowKeys[index]]];
    let counter = 3;
    //missing stars misalignes the content, so add invisible stars to make them all aligned
    while (row[rowKeys[index]].split("+").length < counter) {
      rowAsArray.unshift("+");
      counter -= 1;
    }
    return (
      <StyledTableCell key={index} align="center" className={className}>
        {row[rowKeys[index]].substring(row[rowKeys[index]].lastIndexOf("+"))}
        <div className="raider-io-stars-container">
          {rowAsArray.map((char, i) => {
            if ([...row[rowKeys[index]]][i] === "+")
              return <StarRateIcon key={i} className="raider-io-star" />;
            return <StarRateIcon key={i} className="raider-io-star hidden" />;
          })}
        </div>
      </StyledTableCell>
    );
  }

  /**
   * Return the color for a raider io score
   * @param {int} roleScore The score associated with a role
   * @returns the color associated with that score
   */
  function getRaiderIOScoreColor(roleScore) {
    for (
      var i = 0;
      i < props.data.parsedRaiderIOData.colors.length;
      i++
    ) {
      if (
        roleScore >= props.data.parsedRaiderIOData.colors[i].score
      ) {
        return props.data.parsedRaiderIOData.colors[i].rgbHex;
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
      props.data.parsedRaiderIOData.raiderIO &&
      props.data.parsedRaiderIOData.raiderIO.keys &&
      props.data.parsedRaiderIOData.raiderIO.keys.length !== 0
    );
  }

  function createPersonalizedCellsMostRecent(row, index) {
    const StyledTableCell = TableStyleDefault.styleTableCell();
    const rowKeys = Object.keys(row);
    //adding invisible star so both this table and best dungeons table heights aline
    return (
      <StyledTableCell key={index} align="center">
        {row[rowKeys[index]]}
        <StarRateIcon key={index} className="raider-io-star hidden" />
      </StyledTableCell>
    );
  }

  /**
   * Function which returns the most recent keys you have run this season (number of keys equivalent to the number of dungeons this season)
   * @returns The most recents keys you have run this season
   */
  function returnRaiderIORecentKeys(headers) {
    return (
      <div className="recent-keys">
        <h6 className="hidden small-margin-bottom">.</h6>
        <h4>Most Recent Runs</h4>
        <CustomTable
          headers={headers}
          rows={props.data.parsedRaiderIOData.raiderIO.recentRuns}
          personalizedCells={(row, index) =>
            createPersonalizedCellsMostRecent(row, index)
          }
        />
      </div>
    );
  }

  /**
   * In case the player has not done a single m+ key this season, return an empty table with all the dungeons
   * @param {Object} allDungeons Dictionary representing all the dungeons of the season
   * @returns Dictionary with all the dungeons of the season set to not done ("-")
   */
  function createEmptyTableArray(allDungeons) {
    let returnArray = [];
    if (allDungeons) {
      allDungeons.map((dungeon, i) => {
        returnArray.push({
          dungeon: dungeon.name,
          tyrannical: "-",
          fortified: "-",
        });
        return null;
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
            props.data.parsedRaiderIOData.dungeons.dungeons
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
