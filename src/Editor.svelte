<script lang="ts">
	import { onMount, setContext, untrack } from 'svelte';
	import 'grapesjs/dist/css/grapes.min.css';
	import Toolbar from './panels/Toolbar.svelte';
	import NavBar from './panels/NavBar.svelte';
	import Blocks from './panels/Blocks.svelte';
	import Images from './panels/Images.svelte';
	import Icons from './panels/Icons.svelte';
	import Traits from './panels/Traits.svelte';
	import RichTextEditor from './panels/RichTextEditor.svelte';
	import { writable } from 'svelte/store';
	import { persisted } from 'svelte-persisted-store';
	import type { Editor } from 'grapesjs';

	import { PaneGroup, Pane, PaneResizer, type PaneAPI } from 'paneforge';
	import { debounce } from '$utils/debounce';
	import { browser } from '$app/environment';
	import { Icon, Card, clickOutside } from '@paulpopa/svelte-material';
	import { DragIndicator } from '@paulpopa/icons/md/outlined';
	const panels = persisted('editor-panels', { left: '', right: '' });
	const editor = writable<Editor>();

	let GrapesRef: HTMLElement;

	let {content=$bindable(),culture,onChange} : {content:string,culture:string; onChange?:(content:string)=>void} = $props();

	let value = $state<string>();

	
	$effect(()=> { 
		content; 
		if(!$editor) return;
		
		untrack(()=> {
			if(value == content) return;
			updateEditor(content);
			value = content
		})}
	);

	let innerUpdate = false;
	const setInnerUpdateFlag = (value: boolean) => (innerUpdate = value);
	const deboucedUpdateFlag = debounce(setInnerUpdateFlag, 150);

	onMount(async () => {
		if (browser) {
			const [grapesjs, config] = await Promise.all([
				import('grapesjs').then((x) => x.default),
				import('./config').then((x) => x.default)
			]);
			$editor = grapesjs.init({
				...config,
				container: GrapesRef,
				autorender: false
			} as any) as unknown as Editor;
		}
		$editor.runCommand('tailwind');
		$editor.on('change:changesCount', updateContent);
		$editor.on('component:update', updateContent);
		$editor.on('component:selected', () => ($panels.right = 'styles'));
		setTimeout(() => $editor.render(), 100);
	});
	setContext('editor', editor);

	const updateContent = () => {
		const css = 'style';
		value = `<${css}>${$editor.getCss({ onlyMatched: true })}</${css}>${$editor.DomComponents.getWrapper().getInnerHTML()}`
		if(value == content) return;
		content = value;
		onChange?.(content);
	};

	const deboucedUpdate = debounce(updateContent, 150);

	export const updateEditor = (content: string) => {
		if (content?.includes('tailwind')) {
			const template = document.createElement('template');
			template.innerHTML = content;
			const styles = template.content.querySelectorAll('style');

			styles.forEach((style) => style.hasAttribute('tailwind') && style.remove());
			content = template.innerHTML;
		}
		$editor.setComponents(content);
	};
	


	let leftPane = $state<PaneAPI>();
	let rightPane = $state<PaneAPI>();
	$effect(()=>$panels.right ? rightPane?.expand() : rightPane?.collapse())
	$effect(()=>$panels.left ? leftPane?.expand() : leftPane?.collapse())
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex flex-col h-full w-full bg-slate-900 overflow-hidden" on:mouseleave={deboucedUpdate}>
	{#if $editor}
		<NavBar />
		<Images />
		<Icons />
		<Toolbar />
		<RichTextEditor />
	{/if}
	<PaneGroup direction="horizontal" class='h-0 grow'>
		<Pane
			collapsible
			bind:pane={leftPane}
			onCollapse={() => ($panels.left = null)}
			onExpand={() => ($panels.left = 'layers')}
			defaultSize={15}
			minSize={10}
		>
			<Card class="h-full">
				<grapes-layers class="block" ></grapes-layers>
			</Card>
		</Pane>

		<PaneResizer class="relative w-2 flex items-center justify-center z-10">
			<Icon path={DragIndicator} class="h-6 w-4 rounded bg-green-600" />
		</PaneResizer>

		<Pane defaultSize={50} minSize={25}>
			<Card class="h-full">
				<grapes-editor class="w-full h-full" bind:this={GrapesRef} ></grapes-editor>
			</Card>
		</Pane>

		<PaneResizer class="relative w-2 flex items-center justify-center z-10">
			<Icon path={DragIndicator} class="h-6 w-4 rounded bg-green-600" />
		</PaneResizer>
		<Pane
			collapsible
			bind:pane={rightPane}
			onCollapse={() => ($panels.right = null)}
			onExpand={() => ($panels.right = 'blocks')}
			defaultSize={15}
			minSize={10}
			class="!overflow-auto max-h-full"
		>
			<div class:hidden={$panels.right != 'styles'}>
				<grapes-selectors class="block"></grapes-selectors>
				{#if $editor}
					<Traits />
				{/if}
				<grapes-styles class="block"></grapes-styles>
			</div>

			<div class:hidden={$panels.right != 'blocks'}>
				{#if $editor}
					<Blocks {culture} />
				{/if}
			</div>
		</Pane>
	</PaneGroup>
</div>

<style global>
	:global(.gjs-cv-canvas) {
		height: 100%;
		width: 100%;
		top: 0;
	}

	:global(.gjs-block__media) {
		height: 40px;
		margin-bottom: 6px;
	}
	:global(.gjs-block__media > *) {
		height: 100%;
		width: 100%;
		object-fit: contain;
	}
	:global(.gjs-block-label svg) {
		width: 100%;
		height: 100%;
	}

	:global(.theme--light .gjs-one-bg) {
		background-color: transparent;
	}
	:global(.theme--light .gjs-two-color) {
		color: black;
	}
	:global(.gjs-clm-sels-info) {
		min-height: 19px;
		margin-bottom: 0;
	}
	:global(.gjs-clm-tags #gjs-clm-tag-label) {
		color: white;
	}
	:global(.theme--light .gjs-three-bg) {
		background-color: #cf78c6;
	}
</style>
