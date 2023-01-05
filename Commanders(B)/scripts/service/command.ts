import { Player, world } from "@minecraft/server";
import { runCommandAsync } from "../api/command";
import { scores } from "../api/scoreboard";
import { ADMIN_LIST } from "../common/constants";

const initScoreboard = (player: Player) => {
	scores.forEach(async (score) => {
		await runCommandAsync(`scoreboard objectives add ${score} dummy`, true);
	});

	player.tell({ rawtext: ["Success"] });
};

const test = async (sender: Player) => {
	const asyncFunc = async (i: number) => {
		return sender.runCommandAsync(`say async ${i}`);
	};

	const syncFunc = (i: number) => {
		sender.tell({
			rawtext: [`sync ${i}`]
		});
	};
	
	const func = async () => {
		for (let i = 0; i < 10; i++) {
			asyncFunc(i).then(() => {
				syncFunc(i);
			});
		}
	};

	await func();
};

const adminCommands: { [key: string]: (sender: Player, data: string) => void } = {
	"test": test,
	"initScore": initScoreboard,
};

const commands: { [key: string]: (sender: Player, data: string) => void } = {};

world.events.beforeChat.subscribe((event) => {
	const { sender, message } = event;

	const key = message.split(" ")[0];
	const data = message.replace(key, "").trim();
	let func;

	if (ADMIN_LIST.includes(sender.name)) {
		func = adminCommands[key];

		if (func) {
			func(sender, data);
			event.cancel = true;

			return;
		}
	}

	func = commands[key];
	if (func) {
		func(sender, data);
		event.cancel = true;
	}
});
