import { DynamicPropertiesDefinition, EntityTypes, system, world } from "@minecraft/server";
import { properties, stringPropertyLength } from "./api/property";

system.events.beforeWatchdogTerminate.subscribe(event => {
	event.cancel = true;
	console.warn("[WatchDogError]", event.terminateReason);
});

world.events.worldInitialize.subscribe((event) => {
	for(const [identifier, entityProperty] of Object.entries(properties)) {
		const definition = new DynamicPropertiesDefinition();

		for(const [key, type] of Object.entries(entityProperty)) {
			if(type === "number") {
				definition.defineNumber(key);
			} else if(type === "string") {
				const keyLength = stringPropertyLength[key];
				definition.defineString(key, keyLength);
			} else {
				definition.defineBoolean(key);
			}
		}
		
		event.propertyRegistry.registerEntityTypeDynamicProperties(
			definition,
			EntityTypes.get(identifier),
		);
	}
});