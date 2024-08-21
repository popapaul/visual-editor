import type { IDoc } from './parser/types';
import { components as CompMap } from "../../components";


export const loadComponents = async (content: { nodes: IDoc[]; components: { component: string, props: Record<string, any> }[] }) => {

	const items = await Promise.all(content.components.map(x =>
		CompMap.get(x.component).component()
			.then(mod => ({ Component: mod, props: x.props }))
	));

	return {
		nodes: content.nodes,
		components: items
	}
};