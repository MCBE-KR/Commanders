import { Player } from "@minecraft/server";
import { Job } from "./job";

export class IceMagician extends Job {
	constructor() {
		super({
			kr: "아이스매지션",
		}, {
			cool: {
				1: 50,
				2: 100,
				3: 150,
				4: 400,
			},
			useMn: {
				1: 30,
				2: 50,
				3: 70,
				4: 100,
			},
			maxHp: 2000,
			maxMn: 200,
			hpRegen: 7,
			mnRegen: 10
		});
	}

	checkSkill1(player: Player): string | null {
		return this.getDefaultError(player, 1);
	}

	checkSkill2(player: Player): string | null {
		return this.getDefaultError(player, 2);
	}
	
	checkSkill3(player: Player): string | null {
		return this.getDefaultError(player, 3);
	}

	checkSkill4(player: Player): string | null {
		return this.getDefaultError(player, 4);
	}

	skill1(player: Player): void {
		player.triggerEvent("cmd:ice_magician1");
	}

	skill2(player: Player): void {
		player.tell({
			rawtext: ["Skill2"],
		});
	}

	skill3(player: Player): void {
		player.tell({
			rawtext: ["Skill3"],
		});
	}

	skill4(player: Player): void {
		player.tell({
			rawtext: ["Skill4"],
		});
	}
}