import "../CSS/main.css";
import Helper from "../Helper/helper";
import CustomTable from "./table";
import TableStyleDefault from "../CSS/tableStyleDefault";
import StarRateIcon from "@mui/icons-material/StarRate";
import {
  iparsedRaiderIOData,
  RoleLower,
  iMythicPlusRun,
  mythicPlusRunCategories,
  iRecentMythicPlusRun,
  mythicPlusRecentRunCategories,
  dungeon,
} from "../interfaces/lookup/interface";

interface Props {
  data: {
    name: string;
    server: string;
    parsedRaiderIOData: iparsedRaiderIOData;
  };
}

const RaiderioComponent = (props: Props) => {
  /**
   * Function which returns the best keys you have run this season
   * @returns The best keys you have run this season
   */
  function returnRaiderIOBestKeys(headers: string[]) {
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
                        props.data.parsedRaiderIOData.raiderIO.score[
                          role.toLowerCase() as RoleLower
                        ]
                      ),
                    }}
                  >
                    {
                      props.data.parsedRaiderIOData.raiderIO.score[
                        role.toLowerCase() as RoleLower
                      ]
                    }{" "}
                    IO
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
          personalizedCells={(row: iMythicPlusRun, index: number) =>
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
  function compareKeys(keyOne: string, keyTwo: string) {
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
  function createPersonalizedCells(row: iMythicPlusRun, index: number) {
    const StyledTableCell = TableStyleDefault.styleTableCell();
    let className = "";
    const rowKeys = Object.keys(row);
    let biggestDungeonKey = "";
    for (var i = 0; i < rowKeys.length; i++) {
      if (rowKeys[i] === "fortified" || rowKeys[i] === "tyrannical") {
        biggestDungeonKey = compareKeys(
          row[rowKeys[i] as mythicPlusRunCategories],
          biggestDungeonKey
        )
          ? row[rowKeys[i] as mythicPlusRunCategories]
          : biggestDungeonKey;
      }
    }
    if (
      (rowKeys[index] === "fortified" || rowKeys[index] === "tyrannical") &&
      row[rowKeys[index] as mythicPlusRunCategories] === biggestDungeonKey
    ) {
      className = "underline veryBold";
    }
    let rowAsArray = row[rowKeys[index] as mythicPlusRunCategories].split("");
    let counter = 3;
    //missing stars misalignes the content, so add invisible stars to make them all aligned
    while (
      row[rowKeys[index] as mythicPlusRunCategories].split("+").length < counter
    ) {
      rowAsArray.unshift("+");
      counter -= 1;
    }
    return (
      <StyledTableCell key={index} align="center" className={className}>
        {row[rowKeys[index] as mythicPlusRunCategories].substring(
          row[rowKeys[index] as mythicPlusRunCategories].lastIndexOf("+")
        )}
        <div className="raider-io-stars-container">
          {rowAsArray.map((char, i) => {
            if (
              row[rowKeys[index] as mythicPlusRunCategories].split("")[i] ===
              "+"
            )
              return <StarRateIcon key={i} className="raider-io-star" />;
            return <StarRateIcon key={i} className="raider-io-star hidden" />;
          })}
        </div>
      </StyledTableCell>
    );
  }

  /**
   * Return the color for a raider io score
   * @param {number} roleScore The score associated with a role
   * @returns the color associated with that score
   */
  function getRaiderIOScoreColor(roleScore: number) {
    for (var i = 0; i < props.data.parsedRaiderIOData.colors.length; i++) {
      if (roleScore >= props.data.parsedRaiderIOData.colors[i].score) {
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

  function createPersonalizedCellsMostRecent(
    row: iRecentMythicPlusRun,
    index: number
  ) {
    const StyledTableCell = TableStyleDefault.styleTableCell();
    const rowKeys = Object.keys(row);
    let counter = 3;

    while (row["key"].split("+").length < counter) {
      row["key"].split("").unshift("+");
      counter -= 1;
    }
    return (
      <StyledTableCell key={index} align="left">
        {row[rowKeys[index] as mythicPlusRecentRunCategories].substring(
          row[rowKeys[index] as mythicPlusRecentRunCategories].lastIndexOf("+")
        )}
        {row[rowKeys[2] as mythicPlusRecentRunCategories]
          .split("")
          .map((char, i) => {
            if (char === "+" && index === 2)
              return <StarRateIcon key={i} className="raider-io-star" />;
          })}
      </StyledTableCell>
    );
  }

  /**
   * Function which returns the most recent keys you have run this season (number of keys equivalent to the number of dungeons this season)
   * @returns The most recents keys you have run this season
   */
  function returnRaiderIORecentKeys(headers: string[]) {
    return (
      <div className="recent-keys">
        <h6 className="hidden small-margin-bottom">.</h6>
        <h4>Most Recent Runs</h4>
        <CustomTable
          headers={headers}
          rows={props.data.parsedRaiderIOData.raiderIO.recentRuns}
          headerAlign={"left"}
          personalizedCells={(row: iRecentMythicPlusRun, index: number) =>
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
  function createEmptyTableArray(allDungeons: dungeon[]) {
    let returnArray: iMythicPlusRun[] = [];
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
      ) : (
        <CustomTable
          headers={["Dungeons", "Fortified", "Tyrannical"]}
          rows={createEmptyTableArray(
            props.data.parsedRaiderIOData.dungeons.seasons[0].dungeons
          )}
        />
      )}
      <div className="flex-seperator"></div>
      {verifyProps() && returnRaiderIORecentKeys(["Dungeons", "Keys", "Date"])}
    </div>
  );
};

export default RaiderioComponent;
