import { Entity } from "@minecraft/server";
import { projectiles } from "../common/projectileDef";

// TODO: 태그도 property로 교체하기
export const propertyKeys = [
	// Game
	"gameId",
	"job",
	"team",

	// Stat
	"hp",
	"mn",
	"cool1",
	"cool2",
	"cool3",
	"cool4",

	// Effect
	"strength",
	"stun",
	"poison",

	// Analyzing
	"givenDamage",
	"takenDamage",
	"givenHeal",
	"takenHeal",
	"givenCC",
	"takenCC",
	"recentAttacked",
	"recentHurt",

	// Projectile
	"remainHitCount",
	"summoner",
] as const;
export type PropertyKey = typeof propertyKeys[number];

export type AvailableType = "string" | "number" | "boolean";
type Property = {
	[key in PropertyKey]?: AvailableType
};
type DefinedProperty = {
	[identifier: string]: Property
};

const projectileProperty: Property = {
	"summoner": "number",
	"remainHitCount": "number"
};

const damageableProperty: Property = {
	"hp": "number",
	"mn": "number",
	"cool1": "number",
	"cool2": "number",
	"cool3": "number",
	"cool4": "number",
};

const effectableProperty: Property = {
	...damageableProperty,
	"strength": "number",
	"stun": "number",
	"poison": "number",
};

const projectileProperties: DefinedProperty = {};
projectiles.forEach(identifier => {
	projectileProperties[identifier] = projectileProperty;
});

export const properties: DefinedProperty = {
	...projectileProperties,
	"minecraft:player": {
		...effectableProperty,

		// Game
		"gameId": "number",
		"job": "number",
		"team": "number",

		// Analyzing
		"givenDamage": "number",
		"takenDamage": "number",
		"givenHeal": "number",
		"takenHeal": "number",
		"givenCC": "number",
		"takenCC": "number",
		"recentAttacked": "number",
		"recentHurt": "number",
	},
};

export const stringPropertyLength: {
	[key: string]: number,
} = {

};

export const getProperty = (entity: Entity, key: PropertyKey) => {
	return entity.getDynamicProperty(key);
};

export const setProperty = (
	entity: Entity,
	key: PropertyKey,
	value: string | number | boolean
) => {
	entity.setDynamicProperty(key, value);
};

export const setNumberProperty = (
	entity: Entity,
	key: PropertyKey,
	value: number = 0,
) => {
	entity.setDynamicProperty(key, value);
};

export const setStringProperty = (
	entity: Entity,
	key: PropertyKey,
	value: string = "",
) => {
	entity.setDynamicProperty(key, value);
};

export const setBooleanProperty = (
	entity: Entity,
	key: PropertyKey,
	value: boolean = false,
) => {
	entity.setDynamicProperty(key, value);
};

export const addProperty = (
	entity: Entity,
	key: PropertyKey,
	value: number
) => {
	entity.setDynamicProperty(key, (entity.getDynamicProperty(key) as number) + value);
};

export const copyProperty = (
	targetEntity: Entity,
	originEntity: Entity,
	key: PropertyKey
) => {
	const value = originEntity.getDynamicProperty(key);
	targetEntity.setDynamicProperty(key, value);
};