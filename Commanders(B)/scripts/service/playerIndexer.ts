import { world } from "@minecraft/server";
import { PropertyKey, setProperty } from "../api/property";
import { runUntil } from "../api/task";
import { OVERWORLD } from "../common/constants";

let index = 1;

world.events.worldInitialize.subscribe(() => {
	const gameId: PropertyKey = "gameId";
	const command = `scoreboard players reset * ${gameId}`;

	OVERWORLD.runCommandAsync(command)
		.catch(() => {
			OVERWORLD.runCommandAsync(command)
				.catch(e => console.error(e));
		});
});

world.events.playerJoin.subscribe(event => {
	const { player } = event;
	const currentIndex = index++;
	
	runUntil(() => setProperty(player, "gameId", currentIndex), 5);
});