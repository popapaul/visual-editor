<script lang="ts">
	import type { Components } from './load';
	import type { IDoc } from './parser/types';
	let {nodes, components}:{nodes: IDoc[], components: Components} = $props();

</script>

{#each nodes as node}
	{#if node.type === 'text'}{node.content}{:else if node.type === 'html'}{@html node.content}{:else if node.type === 'tag'}
{#if node.children?.length}<svelte:element this={node.name} {...node.attrs}><svelte:self nodes={node.children} {components} /></svelte:element>{:else}<svelte:element this={node.name} {...node.attrs} />{/if}{:else}
{@const {Component, props} = (components[node.attrs.id]??{})}<Component {...node.attrs} {...props}>
	{#if node.children?.length}<svelte:self nodes={node.children} {components} />{/if}</Component>{/if}{/each}
