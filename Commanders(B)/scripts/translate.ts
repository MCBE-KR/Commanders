const languages = [
	"kr",
] as const;
export type Lang = typeof languages[number];

export type Name = {
	[region in Lang]: string;
};

type Language = {
	[region in Lang]: {
		name: string,
		skill: {
			fail: {
				cool: string,
				mana: string
			}
		}
	}
};

export const LANG: Language = {
	kr: {
		name: "한국어",
		skill: {
			fail: {
				cool: "§c스킬 {0} 쿨타임: [§l{1}/{2}§r§c]",
				mana: "§b스킬 {0} 마나: [§l{1}/{2}§r§b]",
			},
		},
	},
};