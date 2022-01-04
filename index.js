import { readFileSync } from "fs";
import { getOptimalTeamForSettings as originalAlgorithm } from "./originalAlgorithm.js";
import { getOptimalTeamForSettings as newAlgorithm } from "./newAlgorithm.js";
import {
  dumpGkpSquad,
  fullSquad,
  skeleton343Squad,
  skeleton433Squad,
  skeleton442Squad,
  skeleton532Squad,
} from "./teamSettings.js";
import { isValid } from "./teamValidator.js";

const BUDGET = 100;

const run = () => {
  const players = JSON.parse(readFileSync("./basic-players.json").toString());
  const expensivePlayers = JSON.parse(
    readFileSync("./expensive-players.json").toString()
  );

  console.log("**Full Squad**");
  console.log("Basic players test");
  testAlgorithms(players, fullSquad);

  console.log("\nExpensive players test");
  testAlgorithms(expensivePlayers, fullSquad);

  console.log("\n**Dump Goalkeeper**");
  console.log("Basic players test");
  testAlgorithms(players, dumpGkpSquad);

  console.log("\nExpensive players test");
  testAlgorithms(expensivePlayers, dumpGkpSquad);

  console.log("\n**442**");
  console.log("Basic players test");
  testAlgorithms(players, skeleton442Squad);

  console.log("\nExpensive players test");
  testAlgorithms(expensivePlayers, skeleton442Squad);

  console.log("\n**433**");
  console.log("Basic players test");
  testAlgorithms(players, skeleton433Squad);

  console.log("\nExpensive players test");
  testAlgorithms(expensivePlayers, skeleton433Squad);

  console.log("\n**343**");
  console.log("Basic players test");
  testAlgorithms(players, skeleton343Squad);

  console.log("\nExpensive players test");
  testAlgorithms(expensivePlayers, skeleton343Squad);

  console.log("\n**532**");
  console.log("Basic players test");
  testAlgorithms(players, skeleton532Squad);

  console.log("\nExpensive players test");
  testAlgorithms(expensivePlayers, skeleton532Squad);
};

const testAlgorithms = async (players, settings) => {
  const dumpPlayers = getDumpPlayers(players, settings);
  const newBudget =
    BUDGET - dumpPlayers.reduce((total, player) => player.value + total, 0);
  console.log("Original algorithm:");
  const originalAlgorthmResult = runAlgorithm(
    players,
    settings,
    newBudget,
    dumpPlayers,
    originalAlgorithm
  );

  console.log("New algorithm:");
  const newAlgorithmResult = runAlgorithm(
    players,
    settings,
    newBudget,
    dumpPlayers,
    newAlgorithm
  );

  if (newAlgorithmResult > originalAlgorthmResult) {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "Nice! You're algorithm is better than the original one! 🎉"
    );
  } else {
    console.log("\x1b[31m%s\x1b[0m", "Bad luck, keep working on it");
  }
};

const runAlgorithm = (players, settings, budget, dumpPlayers, callback) => {
  try {
    const squad = callback(players, settings, budget, dumpPlayers);
    if (
      squad.length + dumpPlayers.length !== 15 ||
      !isValid(squad, settings, dumpPlayers)
    ) {
      console.log("Failed to suggest a valid squad!");
      return 0;
    } else {
      return recordScore(squad);
    }
  } catch (e) {
    console.log("Threw an error suggesting squad!");
    console.log(e.message);
    return 0;
  }
};

const recordScore = (squad) => {
  const score = squad.reduce((total, player) => total + player.score, 0);
  console.log(`Squad score: ${score.toFixed(2)}`);
  return score;
};

const getDumpPlayers = (players, settings) => {
  return [
    ...getDumpPlayersForPosition(players, 1, 2 - settings.goalkeepers),
    ...getDumpPlayersForPosition(players, 2, 5 - settings.defenders),
    ...getDumpPlayersForPosition(players, 3, 5 - settings.midfielders),
    ...getDumpPlayersForPosition(players, 4, 3 - settings.forwards),
  ];
};

const getDumpPlayersForPosition = (players, position, numberOfPlayers) => {
  return players
    .filter((p) => p.position.id === position)
    .sort((a, b) => a.value - b.value)
    .slice(0, numberOfPlayers);
};

run();
