import { Player, world } from "@minecraft/server";
import { getProperty } from "../api/property";
import { OVERWORLD } from "../common/constants";

const cacheKeys = ["gameId"] as const;
export type CacheKey = typeof cacheKeys[number];

const cached: {
	[key in CacheKey]: {
		[identifier: string]: any,
	};
} = {
	gameId: {},
};

export const getCache = (cacheKey: CacheKey, findValue: number): any => {
	const cache = cached.gameId[findValue];
	if(cache) {
		return cache;
	}

	for(const player of OVERWORLD.getPlayers()) {
		const score = getProperty(player, cacheKey);
		if(score !== findValue) {
			continue;
		}

		cached.gameId[score] = player;
		return player;
	}

	throw new Error(`Failed to find player by ${cacheKey} - ${findValue}`);
};

const cachedPlayers: {
	[playerName: string]: Player
} = {};

export const findPlayer = (playerName: string) => {
	const cachedPlayer = cachedPlayers[playerName];
	if (cachedPlayer) {
		return cachedPlayer;
	}

	for(const player of OVERWORLD.getPlayers()) {
		if(player.name === playerName) {
			return player;
		}
	}

	throw new Error(`Failed to find player by name - ${playerName}`);
};