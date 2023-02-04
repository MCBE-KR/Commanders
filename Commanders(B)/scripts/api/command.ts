import { Entity } from "@minecraft/server";
import { OVERWORLD } from "../common/constants";
import { getProperty } from "./property";

export const exceptSpectator = (targets: Entity[]) => {
	return targets.filter((target) => !target.hasTag("spectator"));
};

export const gatAllies = (player: Entity, targets: Entity[]) => {
	const teamScore = getProperty(player, "team");
	return targets.filter((target) => getProperty(target, "team") === teamScore);
};

export const getEnemies = (player: Entity, targets: Entity[]) => {
	const teamScore = getProperty(player, "team");
	return targets.filter((target) => getProperty(target, "team") !== teamScore);
};

export const run = (func: any) => {
	try {
		func();
		// tslint:disable-next-line: no-empty
	} catch {}
};

export const handleError = (e: unknown, ignoreError: boolean) => {
	if (!ignoreError) {
		throw e;
	}
};

export const runCommandAsync = async (
	command: string,
	ignoreError: boolean = false,
) => {
	return OVERWORLD.runCommandAsync(command).catch((e) => {
		handleError(e, ignoreError);
	});
};

export const runCommandAsyncOn = async (
	entity: Entity,
	command: string,
	ignoreError: boolean = false,
) => {
	return entity.runCommandAsync(command).catch((e) => {
		handleError(e, ignoreError);
	});
};
