import { Entity, Location, system, Vector3, world } from "@minecraft/server";
import { getCache } from "../api/cacheable";
import { getProperty } from "../api/property";
import { PROJ_ID, TEAM1, TEAM2 } from "../common/constants";
import { Projectile, projectileData } from "../common/projectile";
import { giveDamage } from "../common/utils";

const tpEntities: {
	entity: Entity;
	gameId: number;
	viewVector: Vector3;
	tags: string[];
}[] = [];

world.events.beforeDataDrivenEntityTriggerEvent.subscribe(event => {
	const { entity, id } = event;
	if(id !== "cmd:proj_handle") {
		return;
	}

	const identifier = entity.typeId;
	if (!identifier.startsWith(PROJ_ID)) {
		return;
	}

	const gameId = getProperty(entity, "summoner") as number;
	const summoner = getCache("gameId", gameId);
	if (summoner.hasTag(TEAM1)) {
		entity.addTag(TEAM1);
	} else {
		entity.addTag(TEAM2);
	}

	tpEntities.push({
		entity,
		gameId,
		viewVector: summoner.viewVector,
		tags: [summoner.hasTag(TEAM1) ? TEAM2 : TEAM1],
	});
});

const checkRemainHitCount = (entity: Entity) => {
	const remainHitCount = getProperty(entity, "remainHitCount");
	if (remainHitCount <= 1) {
		entity.triggerEvent(`${PROJ_ID}hit_despawn`);
	} else {
		entity.triggerEvent(`${PROJ_ID}hit`);
	}
};

world.events.entityHit.subscribe(event => {
	const { entity } = event;

	const projId = entity.typeId;
	if(!projId.startsWith(PROJ_ID)) {
		return;
	}

	checkRemainHitCount(entity);
});

system.runSchedule(() => {
	const removeIndexes: number[] = [];
	tpEntities.forEach(async ({entity, gameId, viewVector, tags}, index) => {
		try {
			entity.setVelocity(viewVector);
		} catch {
			removeIndexes.push(index);
			return;
		}

		try {
			const { hitRange, damage, maxHitPerOnce, onHit } = projectileData[entity.typeId as Projectile];
			const location = entity.location;
			const targetEntities = Array.from(entity.dimension.getEntities({
				tags,
				location: new Location(location.x, location.y - 0.95, location.z),
				closest: maxHitPerOnce || 1,
				maxDistance: hitRange,
			}));

			if(!targetEntities.length) {
				return;
			}

			for(const target of targetEntities) {
				if(onHit) {
					await onHit(entity, target);
				}

				let targetId;
				if(target) {
					targetId = getProperty(target, "gameId") as number;
				}
				
				giveDamage(target, entity, damage || 0, targetId, gameId);
			}

			checkRemainHitCount(entity);
		} catch(e) {
			console.error(e);
		}
	});

	removeIndexes.forEach(index => {
		tpEntities.splice(index, 1);
	});
}, 1);