import { Player, world } from "@minecraft/server";
import { findPlayer } from "../api/cacheable";
import { getProperty, PropertyKey, setProperty } from "../api/property";
import { ADMIN_LIST } from "../common/constants";

const test = async (sender: Player) => {
	sender.runCommandAsync("say hi");
};

const handleProperty = (sender: Player, data: string) => {
	const split = data.split(" ");
	const subCmd = split[0];

	let playerName = split[1];
	let index = 2;
	if (playerName.startsWith(`"`)) {
		if(playerName.endsWith(`"`)) {
			playerName = playerName.replaceAll(`"`, "");
		} else {
			for (; index < split.length; index++) {
				playerName += ` ${split[index]}`;

				if (playerName.endsWith(`"`)) {
					playerName = playerName.replaceAll(`"`, "");
					break;
				}
			}

			index++;
		}
	}

	const player = findPlayer(playerName);
	const key = split[index++] as PropertyKey;

	if(subCmd === "get") {
		const value = getProperty(player, key);
		sender.tell({
			rawtext: [String(value)],
		});
	} else if(subCmd === "set") {
		let value = split[index] as any;
		if(!isNaN(value)) {
			value = Number(value);
		} else if(value === "true" || value === "false") {
			value = Boolean(value);
		}

		setProperty(player, key, value);
		sender.tell({
			rawtext: ["Success"],
		});
	} else {
		throw new Error(`Unknown subCommand - ${subCmd}`);
	}
};

const adminCommands: { [key: string]: (sender: Player, data: string) => void } = {
	"test": test,
	"property": handleProperty,
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
