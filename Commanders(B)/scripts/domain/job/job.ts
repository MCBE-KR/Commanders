import { Player } from "@minecraft/server";
import { format } from "Commanders(B)/scripts/common/utils";
import LANG from "Commanders(B)/scripts/translate";
import { getScore, setScore } from "../../api/scoreboard";

type Stat = {
	cool1: number;
	cool2: number;
	cool3: number;
	cool4: number;

	maxHp: number;
	maxMn: number;

	hpRegen: number;
	mnRegen: number;
};

export abstract class Job {
	protected stat: Stat;

	constructor(stat: Stat) {
		this.stat = stat;
	}

	abstract checkSkill1(player: Player): string | null;
	abstract checkSkill2(player: Player): string | null;
	abstract checkSkill3(player: Player): string | null;
	abstract checkSkill4(player: Player): string | null;

	getCoolError(player: Player, skillNumber: number) {
		return format(
			LANG.kr.skill.fail.cool,
			skillNumber,
			this.getRemainCool1(player),
			this.stat.cool1,
		);
	}

	getMnError(player: Player, skillNumber: number) {
		return format(
			LANG.kr.skill.fail.mana,
			skillNumber,
			this.getMn(player),
			this.stat.maxMn,
		);
	}

	abstract skill1(player: Player): void;
	abstract skill2(player: Player): void;
	abstract skill3(player: Player): void;
	abstract skill4(player: Player): void;

	getRemainCool1(player: Player) {
		return getScore(player, "cool1");
	}

	getRemainCool2(player: Player) {
		return getScore(player, "cool2");
	}

	getRemainCool3(player: Player) {
		return getScore(player, "cool3");
	}

	getRemainCool4(player: Player) {
		return getScore(player, "cool4");
	}

	getHp(player: Player) {
		return getScore(player, "hp");
	}

	getMn(player: Player) {
		return getScore(player, "mn");
	}

	async addHp(
		player: Player,
		hp: number,
		currentHp: number = this.getHp(player),
	) {
		const newHp = Math.max(Math.min(this.stat.maxHp, currentHp + hp), 0);
		return setScore(player, "hp", newHp);
	}

	async addMn(
		player: Player,
		mn: number,
		currentMn: number = this.getMn(player),
	) {
		const newMn = Math.max(Math.min(this.stat.maxMn, currentMn + mn), 0);
		return setScore(player, "mn", newMn);
	}
}