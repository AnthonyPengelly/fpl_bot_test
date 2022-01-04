export const isValid = (players, settings, otherPlayersInTeam) => {
  const fullTeam = players.concat(otherPlayersInTeam);

  if (anyDuplicates(fullTeam)) {
    return false;
  }

  if (fullTeam.length > settings.maxPlayers) {
    return false;
  }

  // Goalkeepers
  if (fullTeam.filter((player) => player.position.id === 1).length > 2) {
    return false;
  }

  // Defenders
  if (fullTeam.filter((player) => player.position.id === 2).length > 5) {
    return false;
  }

  // Midfielders
  if (fullTeam.filter((player) => player.position.id === 3).length > 5) {
    return false;
  }

  // Forwards
  if (fullTeam.filter((player) => player.position.id === 4).length > 3) {
    return false;
  }

  if (tooManyPlayersFromOneTeam(fullTeam, settings)) {
    return false;
  }

  return true;
};

const tooManyPlayersFromOneTeam = (players, settings) => {
  const playersPerTeam = {};
  players.forEach((playerScore) => {
    playersPerTeam[playerScore.player.team] = playersPerTeam[
      playerScore.player.team
    ]
      ? playersPerTeam[playerScore.player.team].concat(playerScore)
      : [playerScore];
  });

  return (
    Object.values(playersPerTeam).filter(
      (players) => players.length > settings.maxPlayersPerTeam
    ).length !== 0
  );
};

const anyDuplicates = (players) => {
  const playersById = {};
  players.forEach((playerScore) => {
    playersById[playerScore.player.id] = playersById[playerScore.player.id]
      ? playersById[playerScore.player.id].concat(playerScore)
      : [playerScore];
  });

  return (
    Object.values(playersById).filter((players) => players.length > 1)
      .length !== 0
  );
};
