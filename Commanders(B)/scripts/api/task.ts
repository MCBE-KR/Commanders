import { system } from "@minecraft/server";

export const runUntil = (func: () => any, runTick: number) => {
	const runId = system.runSchedule(() => {
		try {
			func();
		} catch {
			return;
		}

		system.clearRun(runId);
	}, runTick);

	return runId;
};

export const runAsyncUntil = (func: () => Promise<any>, runTick: number) => {
	const runId = system.runSchedule(async () => {
		func().then(() => system.clearRun(runId));
	}, runTick);

	return runId;
};