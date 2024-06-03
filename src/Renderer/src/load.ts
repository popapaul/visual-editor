import type { ComponentType, SvelteComponent } from 'svelte';
import type { IDoc } from './parser/types';
import { components } from "../../components";
import type { Component } from './parse';

export const loadComponents = async (
	{ nodes, components: componentNames }: { nodes: IDoc[]; components: { component: string, props: Record<string, any> }[] }
) => {
	const items: { component: SvelteComponent, props: Record<string, any> }[] = await Promise.all(componentNames.map(x => {

		return components.get(x.component)().then(mod => ({ component: mod, props: x.props }))
	}));

	return {
		nodes,
		components: items
	}
};