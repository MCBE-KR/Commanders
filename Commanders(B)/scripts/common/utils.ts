import { Entity, Player } from "@minecraft/server";
import { addProperty, getProperty, setProperty } from "../api/property";

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

export const giveDamage = (
	victim: Entity,
	damager: Entity,
	value: number,
	victimId: number | undefined = getProperty(victim, "gameId") as number,
	damagerId: number | undefined = getProperty(damager, "gameId") as number,
) => {
	victim.runCommandAsync("damage @s 1 none")
		.catch(e => console.error(e));

	if(value > 0) {
		addProperty(victim, "hp", -value);
		addProperty(victim, "takenDamage", value);
		addProperty(damager, "givenDamage", value);
	}

	if(victimId) {
		setProperty(damager, "recentAttacked", victimId);
	}

	if(damagerId) {
		setProperty(victim, "recentHurt", damagerId);
	}
};