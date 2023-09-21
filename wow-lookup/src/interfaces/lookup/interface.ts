export type RoleUpper = "DPS" | "Healer" | "Tank";
export type RoleLower = "dps" | "healer" | "tank";
export type mythicPlusRunCategories = "dungeon" | "tyrannical" | "fortified";
export type mythicPlusRecentRunCategories = "dungeons" | "key" | "date"
export type pvpRanks = "Challenger" | "Combatant" | "Rival" | "Duelist" | "Gladiator" | "Elite" | "Legend"

export type difficulties = "lfr" | "normal" | "heroic" | "mythic";

export interface iParse {
  spec: [
    {
      spec: string;
      specID: number;
    }
  ];
  data: [
    {
      boss: string;
      overall: string;
      ilvl: string;
      metric: string;
      killCount: string;
    }
  ];
}

interface iTableData {
  DPS: {
    lfr: iParse;
    normal: iParse;
    heroic: iParse;
    mythic: iParse;
  };
  Healer: {
    lfr: iParse;
    normal: iParse;
    heroic: iParse;
    mythic: iParse;
  };
  Tank: {
    lfr: iParse;
    normal: iParse;
    heroic: iParse;
    mythic: iParse;
  };
}

interface iMainParsePerDifficulty {
  lfr: string;
  normal: string;
  heroic: string;
  mythic: string;
}

export interface iparsedWowlogsData {
  tableData: iTableData;
  highestDifficulty: 0 | 1 | 2 | 3 | 4;
  mainParsePerDifficulty: iMainParsePerDifficulty;
  class: string;
  status?: number;
}

export interface iMythicPlusRun {
  dungeon: string;
  tyrannical: string;
  fortified: string;
}

export interface iRecentMythicPlusRun {
  dungeons: string;
  key: string;
  date: string | "-";
}


interface Color {
  rgbDecimal: number;
  rgbFloat: number[];
  rgbHex: string;
  rgbInteger: number;
  score: number;
}

interface Dungeons {
  dungeonList: dungeon[];
  seasons: season[];
}

export interface dungeon {
  challenge_mode_id: number;
  id: number;
  name: string;
  short_name: string;
  slug: string;
}

export interface season {
  dungeons: dungeon[];
  ends: Record<string, string>[];
  name: string;
  seasonal_affix: string;
  short_name: string;
  slug: string;
}

interface Score {
  all: number;
  dps: number;
  healer: number;
  spec_0: number;
  spec_1: number;
  spec_2?: number;
  tank: number;
}

export interface iparsedRaiderIOData {
  raiderIO: {
    keys: iMythicPlusRun[];
    recentRuns: iRecentMythicPlusRun[];
    score: Score;
  };
  dungeons: Dungeons;
  colors: Color[];
}

export interface iParsedPVPData{
  brackets: Brackets
  rankHistory: rankHistory
}

interface Rating{
  rating: number,
  seasonStats: Stats,
  weeklyStats: Stats
}

export interface Brackets{
  twoRating: Rating,
  threeRating: Rating,
  [key: string] : Rating
}

interface Stats{
  lost: number,
  played: number,
  won: number
}

interface rankHistory{
  id: number,
  seasons: PVPSeason[]
}

export interface PVPSeason{
  completed: boolean,
  name: string
}

export interface PvPBrackets{
  bracket: string,
  rating: string,
  weekly: string,
  weeklyRatio: string,
  season: string,
  seasonRatio: string
}


