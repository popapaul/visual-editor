
import type { ComponentType } from "svelte";
import parser from "./parser";
import stringify from "./parser/stringify";
import type { IDoc, IOptions } from "./parser/types";
import { components } from "../../components";

export const isTag = (node: IDoc) => {
	return node.type == "tag"
}

export const isText = (node: IDoc) => {
	return node.type == "text"
}

export type ProcessNode = (node: IDoc) =>
	{
		component?: string;

		/**
		 * Props that will be passed to `component`.
		 */
		props?: Promise<Record<string, any>>;

		attrs?: Record<string, string>;
		/**
		 * If `true`, children of `node` will not be processed and no `default`
		 * slot is rendered for the `component`.
		 */
		noChildren?: boolean;
	}
	| false
	| void;

type Options = { /**
* Modify, remove or replace a node.
*/
	processNode?: ProcessNode;

	/**
	* Remove element nodes with the specified names.
	*/
	filterTags?: string[];

	/**
	* Remove element attributes with the specified names.
	*/
	filterAttributes?: string[];

	/**
	* Remove element attributes that start with `on:`.
	*/
	filterEventAttributes?: boolean;

	/**
	* Do not render children with sveltes `@html`.
	*/
	noHtmlNodes?: boolean;
} & IOptions

const defaultOptions: Options = {
	components: [],
};

export const parse = async (html: string, options?: Options) => {
	const ast = parser.parse(html, options);
	options = { ...defaultOptions, ...options };
	const { components, nodes } = transform(ast, options);

	return {
		nodes,
		components: await Promise.all(components.map(async ({ component, props }) => ({ component, props: await props }))),
	};
};

export type Component = {
	component: string,
	props: Promise<Record<string, any>>
}



const transform = (domNodes: IDoc[], options: Options
) => {

	const nodes: IDoc[] = [];
	const components: Component[] = [];

	for (const domNode of domNodes) {
		let processResult: ReturnType<ProcessNode> = undefined;


		if (isTag(domNode) && !options.filterTags?.includes(domNode.name!)) {

			// Filter `node.attribs` before processing node
			//domNode.attrs = getFilteredAttributes(domNode, options).attributes;
			processResult = options.processNode?.(domNode);
		}

		if (processResult === false) {
			domNode.removed = true;
			continue;
		}

		if (typeof processResult == "object" && processResult.component) {
			components.push({ component: processResult.component, props: processResult.props });

			const node: IDoc = ({
				type: 'component',
				component: processResult.component,
			});

			if (domNode.attrs) node.attrs = { ...domNode.attrs, ...processResult.attrs };


			if (
				!processResult.noChildren &&
				isTag(domNode) &&
				domNode.children?.length
			) {
				transformAndAddChildren(node, domNode, components, options);
			}

			nodes.push(node);
			continue;
		}

		if (isText(domNode)) {
			// If the previous node is a `TextNode` or `HtmlNode`, append text to data
			const prevNode = nodes.at(-1);
			if (
				prevNode?.type === 'text' ||
				prevNode?.type === 'html'
			) {
				prevNode.content ??= "";
				prevNode.content += domNode.content;
				continue;
			}

			nodes.push(({ type: "text", content: domNode.content }));
			continue;
		}

		if (isTag(domNode)) {
			if (domNode.name === 'script' || domNode.name === 'style') {
				addHtmlNode(domNode, nodes, options);
				continue;
			}

			const node: IDoc = { type: "tag", name: domNode.name };
			const { attributes, hasAttributes } = getFilteredAttributes(
				domNode,
				options,
			);
			if (hasAttributes) node.attrs = attributes;
			if (typeof processResult == "object" && processResult.attrs)
				Object.assign(node.attrs, processResult.attrs)


			let hasChildComponents;
			if (domNode.children?.length) {
				hasChildComponents = transformAndAddChildren(
					node,
					domNode,
					components,
					options,
				);
			}

			if (options.noHtmlNodes || hasChildComponents) {
				nodes.push(node);
				continue;
			}

			addHtmlNode(domNode, nodes, options);
		}

		// Ignore all other node types
	}

	return { nodes, components };
};

const transformAndAddChildren = (
	node: IDoc,
	domNode: IDoc,
	components: Component[],
	options: Options,
) => {
	const { nodes: childNodes, components: childComponents } = transform(
		domNode.children!,
		options,
	);

	if (childNodes.length) {
		node.children = childNodes;
		for (const component of childComponents) {
			components.push(component);
		}

		return !!childComponents.length;
	}
};

const getFilteredAttributes = (domNode: IDoc, options: Options) => {
	const attributes: [PropertyKey, string][] = [];
	for (const [name, value] of Object.entries(domNode.attrs ?? {})) {
		if (
			typeof value === 'string' &&
			!options.filterAttributes?.includes(name) &&
			!(options.filterEventAttributes && name.startsWith('on'))
		) {
			attributes.push([name, value]);
		}
	}

	return {
		attributes: (domNode.attrs = Object.fromEntries(attributes)),
		hasAttributes: attributes.length,
	};
};

const addHtmlNode = (domNode: IDoc, nodes: IDoc[], options: Options) => {

	const html = stringify([domNode]);

	// If the previous node is a `TextNode`, change it to `HtmlNode` and
	// append html to data
	const prevNode = nodes.at(-1);
	if (prevNode?.type === "text") {
		prevNode.type = 'html';
		prevNode.content = prevNode.content + html;
		return;
	}

	// If the previous node is a `HtmlNode`, append html to data
	if (prevNode?.type === 'html') {
		prevNode.content += html;
		return;
	}

	nodes.push({
		type: 'html',
		content: html,
	});
};