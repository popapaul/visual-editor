<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { NavigationDrawer } from '@paulpopa/svelte-material';
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
	//import Layers from './panels/Layers.svelte';
	import Styles from './panels/Styles.svelte';
	import Selectors from './panels/Selectors.svelte';
	import { debounce } from '$utils/debounce';
	import { browser } from '$app/environment';
	const leftDrawer = persisted('leftDrawer', 0);
	const rightDrawer = persisted('rightDrawer', 0);
	const editor = writable<Editor>();

	let GrapesRef: HTMLElement;
	export let content: string = '';
	export let culture: string = 'ro';
	let innerUpdate = false;	
	const setInnerUpdateFlag = (value:boolean)=>innerUpdate = value;
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
		$editor.on('component:selected', () => ($rightDrawer = 1));
	});
	setContext('editor', editor);

	const updateContent = () => {
		const css = 'style';
		innerUpdate = true;

		content = `<${css}>${$editor.getCss({ onlyMatched: true })}</${css}>${$editor.DomComponents.getWrapper().getInnerHTML()}`;
		setTimeout(()=>deboucedUpdateFlag(false),150);
	};
	
	const deboucedUpdate = debounce(updateContent, 700);

	export const updateEditor = (content: string) => {
		if(innerUpdate) return;
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
</script>

<div class="editor overflow-hidden">
	<grapes-editor class="mb-5" style="grid-area:editor" bind:this={GrapesRef} />

	{#if $editor}
		<NavBar />
		<NavigationDrawer
			width={300}
			style="grid-area:right;"
			mini={!$rightDrawer}
			miniWidth="0"
			right
			active={$rightDrawer > 0}
		>

			<div class="flex flex-col h-0" class:hidden={$rightDrawer != 1}>
				
				<Selectors />
				<Traits />
				<Styles />
			
			</div>
			<div class="flex flex-col h-0" class:hidden={$rightDrawer != 2}>
				<Blocks {culture} />
			</div>
		</NavigationDrawer>
		<Images />
		<Icons />
		<Toolbar />
		<RichTextEditor />
	{/if}
</div>

<style global>
	.editor {
		background: #3a3a3a;
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'toolbar toolbar toolbar'
			'left editor right';
	}
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
</style>
