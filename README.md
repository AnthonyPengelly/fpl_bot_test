# FPL Bot Test

With a node version of at least 13.x run the following:

```
node index.js
```

Update the file `./newAlgorithm.js` with your algorithm to see if you can win all of the tests!

## The problem

Given a list of players with a cost (`x.value`) and a score (`x.score`), how can we choose a full squad
within the budget to maximise the total score.

This is very similar to the (knapsack problem)[https://en.wikipedia.org/wiki/Knapsack_problem]. However,
there are a number of restrictions on which squads are valid (see `./teamValidator.js`):

- A 15 man squad has 2 goalkeepers, 5 defenders, 5 midfielers and 3 forwards
- There can only be a maximum of 4 players from any given team (`x.player.team`)
- The squad must have exactly 15 players
- There cannot be any duplicate players

The original algorithm uses a common solution to the knapsack problem, but just ignores
all cases that generate an invalid team. This produces good results, but they are not always
optimal, and in some cases fails to generate a full team (often when the best players are quite expensive).

The algorithm should also work for the case where the "bench" is prepopulated with cheap players,
and therefore a specific number of defenders, midfielders and forwards are required for the starting 11 (a formation).

## Logs

The results of the latest test can be found in `./logs`.