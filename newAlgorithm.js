export const getOptimalTeamForSettings = (
  players,
  settings,
  budget,
  benchPlayers = []
) => {
  const goalkeepers = players.filter(
    (player) => player.position.id === 1 && player.player.team <= 2
  );
  const defenders = players.filter(
    (player) =>
      player.position.id === 2 &&
      player.player.team > 2 &&
      player.player.team <= 8
  );
  const midfielders = players.filter(
    (player) =>
      player.position.id === 3 &&
      player.player.team > 8 &&
      player.player.team <= 14
  );
  const forwards = players.filter(
    (player) => player.position.id === 4 && player.player.team > 14
  );

  return [
    ...goalkeepers.slice(goalkeepers.length - settings.goalkeepers),
    ...defenders.slice(defenders.length - settings.defenders),
    ...midfielders.slice(midfielders.length - settings.midfielders),
    ...forwards.slice(forwards.length - settings.forwards),
  ];
};
