<script lang="ts">
	// Funny formatting because we don't want to render any extra whitespace
	// Special handling of `svg` tags to let svelte know we are in svg namespace

	import type { ComponentType } from 'svelte';
	import type { IDoc } from './parser/types';
	//import { getComponent, getComponentProps } from './utils';

	/** Nodes returned from `parse`. */
	export let nodes: IDoc[];

	/** Object of components in the form of `{ componentName: component }` */
	export let components: {
		component: ComponentType;
		props: Record<string, any>;
	}[] = [];

	const getComponent = (node: IDoc) => {
		const ceva = components.splice(0, 1)?.[0];

		return ceva;
	};
</script>

{#each nodes as node}
	{#if node.type === 'text'}
		{node.content}
	{:else if node.type === 'html'}
		{@html node.content}
	{:else if node.type === 'tag'}
		{#if node.children?.length}
			<svelte:element this={node.name} {...node.attrs}>
				<svelte:self nodes={node.children} {components} />
			</svelte:element>
		{:else}
			<svelte:element this={node.name} {...node.attrs} />
		{/if}
	{:else}
		{@const { component, props } = getComponent(node)}
		<svelte:component this={component} {...node.attrs} {...props}>
			{#if node.children?.length}
				<svelte:self nodes={node.children} {components} />
			{/if}
		</svelte:component>
	{/if}
{/each}
