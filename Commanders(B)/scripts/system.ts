import { system } from "@minecraft/server";

system.events.beforeWatchdogTerminate.subscribe(event => {
	event.cancel = true;
	console.warn("[WatchDogError]", event.terminateReason);
});