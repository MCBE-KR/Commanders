import { world } from "@minecraft/server";
import { getScore } from "../api/scoreboard";
import { isPlayer } from "../common/utils";
import { jobs } from "../domain/job/instance";

const prefix = "namsic_keyboard:key";

world.events.beforeDataDrivenEntityTriggerEvent.subscribe(event => {
	try {
		const { id, entity: player } = event;
		if(!isPlayer(player) || !id.startsWith(prefix)) {
			return;
		}

		const prefixLength = prefix.length;
		const skillId = Number(id.substring(prefixLength, prefixLength + 1));
		const jobScore = getScore(player, "job");
		const jobInstance = jobs[jobScore];

		if(!jobInstance) {
			player.tell({
				rawtext: [`Input: ${skillId}`],
			});
			return;
		}

		switch (skillId) {
			case 0:
				jobInstance.skill1(player);
				break;

			case 1:
				jobInstance.skill2(player);
				break;
				
			case 2:
				jobInstance.skill3(player);
				break;

			case 3:
				jobInstance.skill4(player);
				break;

			default:
				console.error(`Skill ${skillId} is not implemented`);
				return;
		}
	} catch(e) {
		console.error("Error Occurred in socket.ts", e);
	}
});