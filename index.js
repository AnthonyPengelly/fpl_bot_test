import { readFileSync, writeFileSync } from "fs";
import { getOptimalTeamForSettings as originalAlgorithm } from "./originalAlgorithm.js";
import { getOptimalTeamForSettings as newAlgorithm } from "./newAlgorithm.js";
import {
  singleGkpSquad,
  fullSquad,
  skeleton343Squad,
  skeleton433Squad,
  skeleton442Squad,
  skeleton532Squad,
} from "./teamSettings.js";
import { isValid } from "./teamValidator.js";

const BUDGET = 100;

const tests = [
  { title: "Full Squad", settings: fullSquad },
  { title: "Single Goalkeeper", settings: singleGkpSquad },
  { title: "442", settings: skeleton442Squad },
  { title: "433", settings: skeleton433Squad },
  { title: "343", settings: skeleton343Squad },
  { title: "532", settings: skeleton532Squad },
];

const run = () => {
  const players = JSON.parse(readFileSync("./basic-players.json").toString());
  const expensivePlayers = JSON.parse(
    readFileSync("./expensive-players.json").toString()
  );
  tests.forEach((test) => {
    console.log(`\n**${test.title}**`);
    console.log("Basic players");
    testAlgorithms(players, test.settings, `${test.title}-Basic Players`);
    console.log("\nExpensive players");
    testAlgorithms(
      expensivePlayers,
      test.settings,
      `${test.title}-Expensive Players`
    );
  });
};

const testAlgorithms = async (players, settings, testId) => {
  const benchPlayers = getBenchPlayersForSettings(players, settings);
  const newBudget =
    BUDGET - benchPlayers.reduce((total, player) => player.value + total, 0);
  console.log("Original algorithm:");
  const originalAlgorthmResult = runAlgorithm(
    players,
    settings,
    newBudget,
    benchPlayers,
    originalAlgorithm,
    `${testId}-Original Algorithm`
  );

  console.log("New algorithm:");
  const newAlgorithmResult = runAlgorithm(
    players,
    settings,
    newBudget,
    benchPlayers,
    newAlgorithm,
    `${testId}-New Algorithm`
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

const runAlgorithm = (
  players,
  settings,
  budget,
  benchPlayers,
  callback,
  testId
) => {
  try {
    const squad = callback(players, settings, budget, benchPlayers);
    logSquad(squad, benchPlayers, testId);
    if (
      !squad ||
      squad.length + benchPlayers.length !== 15 ||
      calculateCost(squad) > budget ||
      !isValid(squad, settings, benchPlayers)
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
  const score = calculateScore(squad);
  console.log(`Squad score: ${score.toFixed(2)}`);
  return score;
};

const getBenchPlayersForSettings = (players, settings) => {
  return [
    ...getBenchPlayersForPosition(players, 1, 2 - settings.goalkeepers),
    ...getBenchPlayersForPosition(players, 2, 5 - settings.defenders),
    ...getBenchPlayersForPosition(players, 3, 5 - settings.midfielders),
    ...getBenchPlayersForPosition(players, 4, 3 - settings.forwards),
  ];
};

const getBenchPlayersForPosition = (players, position, numberOfPlayers) => {
  return players
    .filter((p) => p.position.id === position)
    .sort((a, b) => a.value - b.value)
    .slice(0, numberOfPlayers);
};

const logSquad = (squad, benchPlayers, testId) => {
  const squadScore = squad && squad.length ? calculateScore(squad) : 0;
  const cost =
    squad && squad.length
      ? calculateCost([...squad, ...benchPlayers])
      : calculateCost(benchPlayers);
  const squadForLogs = squad && squad.length ? squad.map(playerForLogs) : [];
  const benchForLogs = benchPlayers.map(playerForLogs);
  const totalPlayers = squadForLogs.length + benchForLogs.length;
  writeFileSync(
    `./logs/${testId}.json`,
    JSON.stringify(
      {
        squadScore,
        cost,
        budget: BUDGET,
        totalPlayers,
        squad: squadForLogs,
        bench: benchForLogs,
      },
      null,
      2
    )
  );
};

const playerForLogs = (player) => ({
  id: player.player.id,
  name: player.player.web_name,
  teamId: player.player.team,
  positionId: player.position.id,
  position: player.position.singular_name_short,
  score: player.score,
  cost: player.value,
});

const calculateScore = (squad) =>
  squad.reduce((total, player) => total + player.score, 0);

const calculateCost = (squad) =>
  squad.reduce((total, player) => total + player.value, 0);

run();
