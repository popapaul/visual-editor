import type { ComponentType } from 'svelte';
import type { IDoc } from './parser/types';
import { components } from "../../components";

export const loadComponents = async (
	{ nodes, components: componentNames }: { nodes: IDoc[]; components: { component: string, props: Record<string, any> }[] }
) => {
	const items: { component: ComponentType, props: Record<string, any> }[] = await Promise.all(componentNames.map(x => {

		return components.get(x.component).component().then(mod => ({ component: mod, props: x.props }))
	}));

	return {
		nodes,
		components: items
	}
};