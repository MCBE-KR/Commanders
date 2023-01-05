import { Entity, Player } from "@minecraft/server";
import { addScore, getScore, setScore } from "../api/scoreboard";

export const format = (str: string, ...args: any[]) => {
	let i = 0;
	let result = str;
	for (const arg of args) {
		result = result.split(`{${i++}}`).join(arg);
	}

	return result;
};

export const sendFormatted = (player: Player, str: string, ...args: any[]) => {
	player.tell({
		rawtext: [format(str, ...args)],
	});
};

export const isPlayer = (entity: Entity): entity is Player => {
	return entity.typeId === "minecraft:player";
};

export const damage = (
	victim: Entity,
	damager: Entity,
	value: number,
	victimId: number = getScore(victim, "gameId"),
	damagerId: number = getScore(damager, "gameId"),
) => {
	victim.runCommandAsync("damage @s 1 none");

	addScore(victim, "hp", -value);
	addScore(victim, "takenDamage", value);
	addScore(damager, "givenDamage", value);
	setScore(victim, "recentHurt", damagerId);
	setScore(damager, "recentAttacked", victimId);
};