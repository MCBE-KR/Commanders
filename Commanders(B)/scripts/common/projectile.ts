import { Entity, Location, Player } from "@minecraft/server";
import { getProperty, setProperty } from "../api/property";
import { OVERWORLD, PROJ_ID } from "./constants";
import { projectiles } from "./projectileDef";

export type Projectile = typeof projectiles[number];
export const projectileData: {
	[key in Projectile]: {
		velocityMultiplier: number;
		hitRange: number;
		yOffset?: number;
		damage?: number;
		maxHitPerOnce?: number;
		remainHitCount?: number;
		onHit?: (entity: Entity, target: Entity) => Promise<void>;
	};
} = {
	"cmd:proj_ice_magician1": {
		velocityMultiplier: 2.5,
		hitRange: 1.35,
	},
	"cmd:proj_ice_magician2": {
		velocityMultiplier: 4.2,
		hitRange: 1.1,
	},
};

export const spawnProjectile = async (player: Player, projectile: Projectile) => {
	const data = projectileData[projectile];

	const { velocityMultiplier, remainHitCount } = data;
	const yOffset = data.yOffset || 1.3;

	const location = player.location;
	const viewVector = player.viewVector;

	const entity = OVERWORLD.spawnEntity(projectile, new Location(
		location.x,
		location.y + yOffset,
		location.z
	));

	if(player.hasTag("team1")) {
		entity.addTag("team1");
	} else {
		entity.addTag("team2");
	}

	const velocity = {
		x: viewVector.x * velocityMultiplier,
		y: viewVector.y * velocityMultiplier,
		z: viewVector.z * velocityMultiplier,
	};
	
	entity.setVelocity(velocity);

	const gameId = getProperty(player, "gameId") as number;
	setProperty(entity, "summoner", gameId);
	setProperty(entity, "remainHitCount", remainHitCount || 1);

	entity.triggerEvent(`${PROJ_ID}handle`);
};