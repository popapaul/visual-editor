<script lang="ts">
	import { onMount, setContext } from 'svelte';
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
	import { Icon, Card } from '@paulpopa/svelte-material';
	import { DragIndicator } from '@paulpopa/icons/md/outlined';
	const panels = persisted('editor-panels', { left: '', right: '' });
	const editor = writable<Editor>();

	let GrapesRef: HTMLElement;
	export let content: string = '';
	export let culture: string = 'ro';
	let innerUpdate = false;
	const setInnerUpdateFlag = (value: boolean) => (innerUpdate = value);
	const deboucedUpdateFlag = debounce(setInnerUpdateFlag, 700);

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
		$editor.on('change:changesCount', deboucedUpdate);
		$editor.on('component:update', deboucedUpdate);
		$editor.on('component:selected', () => ($panels.right = 'styles'));
		setTimeout(() => $editor.render(), 100);
	});
	setContext('editor', editor);

	const updateContent = () => {
		const css = 'style';
		innerUpdate = true;

		content = `<${css}>${$editor.getCss({ onlyMatched: true })}</${css}>${$editor.DomComponents.getWrapper().getInnerHTML()}`;
		setTimeout(() => deboucedUpdateFlag(false), 150);
	};

	const deboucedUpdate = debounce(updateContent, 700);

	export const updateEditor = (content: string) => {
		if (innerUpdate) return;
		if (content?.includes('tailwind')) {
			const template = document.createElement('template');
			template.innerHTML = content;
			const styles = template.content.querySelectorAll('style');

			styles.forEach((style) => style.hasAttribute('tailwind') && style.remove());
			content = template.innerHTML;
		}
		$editor.setComponents(content);
	};

	$: $editor && updateEditor(content);

	let leftPane: PaneAPI, rightPane: PaneAPI;
	$: $panels.right ? rightPane?.expand() : rightPane?.collapse();
	$: $panels.left ? leftPane?.expand() : leftPane?.collapse();
</script>

<div class="h-full w-full bg-slate-900 overflow-hidden" on:mouseleave={deboucedUpdate}>
	{#if $editor}
		<NavBar />
		<Images />
		<Icons />
		<Toolbar />
		<RichTextEditor />
	{/if}
	<PaneGroup direction="horizontal">
		<Pane
			collapsible
			bind:pane={leftPane}
			onCollapse={() => ($panels.left = null)}
			onExpand={() => ($panels.left = 'layers')}
			defaultSize={15}
			minSize={10}
		>
			<Card class="h-full">
				<grapes-layers class="block" />
			</Card>
		</Pane>

		<PaneResizer class="relative w-2 flex items-center justify-center z-10">
			<Icon path={DragIndicator} class="h-6 w-4 rounded bg-green-600" />
		</PaneResizer>

		<Pane defaultSize={50} minSize={25}>
			<Card class="h-full">
				<grapes-editor class="w-full h-full" bind:this={GrapesRef} />
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
		>
			<div class:hidden={$panels.right != 'styles'}>
				<grapes-selectors class="block" />
				{#if $editor}
					<Traits />
				{/if}
				<grapes-styles class="block" />
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
