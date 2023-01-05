import { Player } from "@minecraft/server";
import { Job } from "./job";

export class IceMagician extends Job {
	constructor() {
		super({
			cool1: 50,
			cool2: 100,
			cool3: 150,
			cool4: 400,
			maxHp: 2000,
			maxMn: 200,
			hpRegen: 7,
			mnRegen: 10
		});
	}

	checkSkill1(player: Player): string | null {
		throw new Error("Method not implemented.");
	}

	checkSkill2(player: Player): string | null {
		throw new Error("Method not implemented.");
	}
	
	checkSkill3(player: Player): string | null {
		throw new Error("Method not implemented.");
	}

	checkSkill4(player: Player): string | null {
		throw new Error("Method not implemented.");
	}

	skill1(player: Player): void {
		player.tell({
			rawtext: ["Skill1"],
		});
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