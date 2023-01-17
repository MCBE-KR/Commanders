import { Player } from "@minecraft/server";
import { getScore, setScore } from "../../api/scoreboard";
import { format } from "../../common/utils";
import { LANG, Name } from "../../translate";

type SkillNumber = 1 | 2 | 3 | 4;

type Stat = {
	cool: {
		[skillNumber in SkillNumber]: number;
	};

	useMn: {
		[skillNumber in SkillNumber]: number;
	};

	maxHp: number;
	maxMn: number;

	hpRegen: number;
	mnRegen: number;
};

export abstract class Job {
	protected name: Name;
	protected stat: Stat;

	constructor(name: Name, stat: Stat) {
		this.name = name;
		this.stat = stat;
	}

	abstract checkSkill1(player: Player): string | null;
	abstract checkSkill2(player: Player): string | null;
	abstract checkSkill3(player: Player): string | null;
	abstract checkSkill4(player: Player): string | null;

	abstract skill1(player: Player): void;
	abstract skill2(player: Player): void;
	abstract skill3(player: Player): void;
	abstract skill4(player: Player): void;

	getCoolError(
		player: Player,
		skillNumber: SkillNumber,
		remainCool: number = this.getRemainCool(player, skillNumber),
	) {
		return format(
			LANG.kr.skill.fail.cool,
			skillNumber,
			remainCool,
			this.stat.cool[skillNumber],
		);
	}

	getMnError(player: Player, skillNumber: SkillNumber) {
		return format(
			LANG.kr.skill.fail.mana,
			skillNumber,
			this.getMn(player),
			this.stat.useMn[skillNumber],
		);
	}

	getDefaultError(player: Player, skillNumber: SkillNumber) {
		const remainCool = this.getRemainCool(player, skillNumber);
		if (remainCool > 0) {
			return this.getCoolError(player, skillNumber, remainCool);
		}

		if (this.getMn(player) < this.stat.useMn[skillNumber]) {
			return this.getMnError(player, skillNumber);
		}

		return null;
	}

	getRemainCool(player: Player, skillNumber: SkillNumber) {
		switch (skillNumber) {
			case 1:
				return getScore(player, "cool1");

			case 2:
				return getScore(player, "cool2");

			case 3:
				return getScore(player, "cool3");

			case 4:
				return getScore(player, "cool4");

			default:
				throw new Error(`Invalid Argument ${skillNumber}`);
		}
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