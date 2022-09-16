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
 * A healper class with some static functions to limit repetition
 */
class ClassImages extends React.Component {

  /**
   * Get all images for every ingame spec
   * @returns images of every spec
   */
  static getSpecImages() {
    return {
      Affliction: Affliction,
      Arcane: Arcane,
      Arms: Arms,
      Assassination: Assassination,
      BeastMMastery: BeastMMastery,
      Blood: Blood,
      Boomkin: Boomkin,
      Brewmaster: Brewmaster,
      Demonology: Demonology,
      Destruction: Destruction,
      Discipline: Discipline,
      Elemental: Elemental,
      Enhancement: Enhancement,
      Feral: Feral,
      Fire: Fire,
      Frost: Frost,
      FrostDK: FrostDK,
      Fury: Fury,
      Guardian: Guardian,
      Havoc: Havoc,
      Holy: Holy,
      HolyP: HolyP,
      Marksmanship: Marksmanship,
      Mistweaver: Mistweaver,
      Outlaw: Outlaw,
      Protection: Protection,
      Restoration: Restoration,
      RestorationR: RestorationR,
      Retribution: Retribution,
      Shadow: Shadow,
      Subtlety: Subtlety,
      Survival: Survival,
      Unholy: Unholy,
      Vengeance: Vengeance,
      Windwalker: Windwalker,
    };
  }
}
export default ClassImages;

