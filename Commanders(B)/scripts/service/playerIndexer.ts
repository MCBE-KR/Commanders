import { world } from "@minecraft/server";
import { Score, setScore } from "../api/scoreboard";
import { runAsyncUntil } from "../api/task";
import { OVERWORLD } from "../common/constants";

let INDEX = 0;

world.events.worldInitialize.subscribe(() => {
	const gameId: Score = "gameId";
	OVERWORLD.runCommandAsync(`scoreboard players reset * ${gameId}`);
});

world.events.playerJoin.subscribe(event => {
	const { player } = event;
	const currentIndex = INDEX++;
	
	runAsyncUntil(() => setScore(player, "gameId", currentIndex), 5);
});