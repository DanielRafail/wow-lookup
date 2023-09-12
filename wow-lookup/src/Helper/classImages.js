import "../CSS/main.css";
import React from "react";
import Affliction from "../images/Affliction.png";
import Arcane from "../images/Arcane.png";
import Arms from "../images/Arms.png";
import Assassination from "../images/Assassination.png";
import BeastMMastery from "../images/Beast Mastery.png";
import Blood from "../images/Blood.png";
import Boomkin from "../images/Boomkin.png";
import Brewmaster from "../images/Brewmaster.png";
import Demonology from "../images/Demonology.png";
import Destruction from "../images/Destruction.png";
import Discipline from "../images/Discipline.png";
import Elemental from "../images/Elemental.png";
import Enhancement from "../images/Enhancement.png";
import Feral from "../images/Feral.png";
import Fire from "../images/Fire.png";
import Frost from "../images/Frost.png";
import FrostDK from "../images/FrostDK.png";
import Fury from "../images/Fury.png";
import Guardian from "../images/Guardian.png";
import Havoc from "../images/Havoc.png";
import Holy from "../images/Holy.png";
import HolyP from "../images/HolyP.png";
import Marksmanship from "../images/Marksmanship.png";
import Mistweaver from "../images/Mistweaver.png";
import Outlaw from "../images/Outlaw.png";
import Protection from "../images/Protection.png";
import ProtectionW from "../images/ProtectionW.png";
import Restoration from "../images/Restoration.png";
import RestorationR from "../images/RestorationR.png";
import Retribution from "../images/Retribution.png";
import Shadow from "../images/Shadow.png";
import Subtlety from "../images/Subtlety.png";
import Survival from "../images/Survival.png";
import Unholy from "../images/Unholy.png";
import Vengeance from "../images/Vengeance.png";
import Windwalker from "../images/Windwalker.png";

/**
 * A helper class with some static functions to limit repetition
 */
class ClassImages extends React.Component {
  /**
   * Get all images for every ingame spec
   * @returns images of every spec
   */
  static getSpecImages() {
    return {
      265: Affliction,
      73: ProtectionW,
      62: Arcane,
      71: Arms,
      259: Assassination,
      253: BeastMMastery,
      250: Blood,
      102: Boomkin,
      268: Brewmaster,
      266: Demonology,
      267: Destruction,
      256: Discipline,
      262: Elemental,
      263: Enhancement,
      103: Feral,
      63: Fire,
      64: Frost,
      251: FrostDK,
      72: Fury,
      104: Guardian,
      577: Havoc,
      257: Holy,
      65: HolyP,
      254: Marksmanship,
      270: Mistweaver,
      260: Outlaw,
      66: Protection,
      105: Restoration,
      264: RestorationR,
      70: Retribution,
      258: Shadow,
      261: Subtlety,
      255: Survival,
      252: Unholy,
      581: Vengeance,
      269: Windwalker,
    };
  }
}
export default ClassImages;
