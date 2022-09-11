import "../CSS/main.css";
import Reader from "./reader";
import React from "react";

class Parser extends React.Component {
  static parseRaiderIOData(raiderIOData) {
    const mythicPlusAlternate = raiderIOData.mythic_plus_alternate_runs;
    const mythicPlusBest = raiderIOData.mythic_plus_best_runs;
    const mythicPlusRecent =  raiderIOData.mythic_plus_recent_runs;
    const MythicPlusScore = raiderIOData.mythic_plus_scores_by_season;
    Object.entries(mythicPlusAlternate).map((entry, i)=>{

    })
    const tyrannical = {};

    let parsedData = "";
    return "";
  }

    iterateDungeons(){

  }


  static parseWowlogsData(urlParams, setError) {}

  static parseCheckPVPData(urlParams, setError) {}
}

export default Parser;
