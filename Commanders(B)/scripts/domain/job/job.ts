import { Player } from "@minecraft/server";
import { getProperty, setProperty } from "../../api/property";
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
				return getProperty(player, "cool1") as number;

			case 2:
				return getProperty(player, "cool2") as number;

			case 3:
				return getProperty(player, "cool3") as number;

			case 4:
				return getProperty(player, "cool4") as number;

			default:
				throw new Error(`Invalid Argument ${skillNumber}`);
		}
	}

	getHp(player: Player) {
		return getProperty(player, "hp") as number;
	}

	getMn(player: Player) {
		return getProperty(player, "mn") as number;
	}

	addHp(
		player: Player,
		hp: number,
		currentHp: number = this.getHp(player),
	) {
		const newHp = Math.max(Math.min(this.stat.maxHp, currentHp + hp), 0);
		setProperty(player, "hp", newHp);
	}

	addMn(
		player: Player,
		mn: number,
		currentMn: number = this.getMn(player),
	) {
		const newMn = Math.max(Math.min(this.stat.maxMn, currentMn + mn), 0);
		setProperty(player, "mn", newMn);
	}
}