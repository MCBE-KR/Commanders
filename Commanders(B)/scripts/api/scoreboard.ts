import { Entity, world } from "@minecraft/server";

const SCOREBOARD = world.scoreboard;

export const scores = [
	// Game
	"gameId",
	"job",
	"team",
	
	// Stat
	"hp",
	"mn",
	"cool1",
	"cool2",
	"cool3",
	"cool4",

	// Effect
	"strength",
	"stun",
	"poison",

	// Analyzing
	"givenDamage",
	"takenDamage",
	"givenHeal",
	"takenHeal",
	"givenCC",
	"takenCC",
	"recentAttacked",
	"recentHurt",
] as const;
export type Score = typeof scores[number];

export const getScore = (
	entity: Entity,
	objectiveId: Score,
	defaultValue: number = 0,
) => {
	try {
		return SCOREBOARD.getObjective(objectiveId).getScore(entity.scoreboard);
	} catch {
		return defaultValue;
	}
};

export const setScore = async (
	entity: Entity,
	objectiveId: Score,
	value: number,
) => {
	const command = `scoreboard players set @s ${objectiveId} ${value}`;
	return entity.runCommandAsync(command);
};

export const addScore = async (
	entity: Entity,
	objectiveId: Score,
	value: number,
) => {
	const score = getScore(entity, objectiveId);
	return setScore(entity, objectiveId, score + value);
};

export const hasTag = (entity: Entity, tag: string | string[]) => {
	const tags = entity.getTags();

	if(typeof tag === "string") {
		return tags.includes(tag);
	} else {
		return tags.some(element => tag.includes(element));
	}
};

export const getTag = (entity: Entity, prefix: string) => {
	return entity.getTags().some(tag => tag.startsWith(prefix));
};