import type { IDoc } from './parser/types';
import { components as CompMap } from "../../components";
import type { Component } from './parse';
import type { Component as SvelteComponent } from "svelte"

export type Components = Record<string, { Component: SvelteComponent, props: Record<string, any> }>;

export const loadComponents = async (content: { nodes: IDoc[]; components: Record<string, Component> }) => {
	const resolvedComponents: Components = {};

	const promises = Object.entries(content.components).map(async ([key, { component, props }]) => {
		resolvedComponents[key] = {
			Component: await CompMap.get(component).component(),
			props
		};
	});
	await Promise.all(promises);

	return {
		nodes: content.nodes,
		components: resolvedComponents
	}
};