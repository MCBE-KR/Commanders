import { IceMagician } from "./iceMagician";
import { Job } from "./job";

export const jobs: {
	[key: number]: Job;
} = {
	1: new IceMagician(),
};