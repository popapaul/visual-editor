<script lang="ts">
	import {
		Button,
		Menu,
		List,
		ListItem,
		Icon,
		ColorPicker,
		portal
	} from '@paulpopa/svelte-material';
	import {
		FormatSize,
		Brush,
		FontDownload,
		FormatColorText,
		Link
	} from '@paulpopa/icons/md/filled';
	import { persisted } from 'svelte-persisted-store';
	import { getContext, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Writable } from 'svelte/store';
	import type { Component, Editor } from 'grapesjs';

	type RichTextEditor = typeof $editor.RichTextEditor.globalRte;
	const editor = getContext<Writable<Editor>>('editor');
	let active = false;
	let toolbar;
	let component: Component;
	let rte: RichTextEditor;
	const colors = persisted('editor-colors', []);

	const onSelect = async (selected: Component, rteInst) => {
		component = selected;
		rte = rteInst;
		await tick();
		active = true;
	};

	//$:doc = rte.doc as Document;

	const onDeselect = () => {
		active = false;
	};
	$editor.on('component:select', async (selected: Component) => {
		if (!selected?.attributes?.editable) return;
		//component = selected;
		//	$editor.RichTextEditor.enable(selected.view, $editor.RichTextEditor.globalRte);
	});
	$editor.on('rte:enable', onSelect);
	$editor.on('rte:disable', onDeselect);
	$editor.on('component:deselected', onDeselect);

	const queryCommand = (command: string) => {
		const doc = $editor.Canvas.getDocument() as Document;
		return doc.queryCommandSupported(command) && doc.queryCommandState(command);
	};

	const isValidTag = (rte: RichTextEditor, tagName = 'A') => {
		const { anchorNode, focusNode } = rte.selection();

		const parentAnchor = anchorNode?.parentNode;
		const parentFocus = focusNode?.parentNode;
		return parentAnchor?.nodeName == tagName || parentFocus?.nodeName == tagName;
	};

	const toggleLink = (rte: RichTextEditor) => {
		if (isValidTag(rte)) {
			rte.exec('unlink');
		} else {
			rte.insertHTML(`<a href="">${rte.selection()}</a>`, {
				select: true
			});
		}
	};
	const toggleSpan = (rte: RichTextEditor) => {
		!isValidTag(rte, 'SPAN') &&
			rte.insertHTML(`<span>${rte.selection()}</span>`, {
				select: true
			});
	};

	const fonts = [
		{
			name: 'text-xs',
			size: '0.75rem',
			height: '1rem'
		},
		{
			name: 'text-sm',
			size: '0.875rem',
			height: '1.25rem'
		},
		{
			name: 'text-base',
			size: '1rem',
			height: '1.5rem'
		},
		{
			name: 'text-lg',
			size: '1.125rem',
			height: '1.75rem'
		},
		{
			name: 'text-xl',
			size: '1.25rem',
			height: '1.75rem'
		},
		{
			name: 'text-2xl',
			size: '1.5rem',
			height: '2rem'
		},
		{
			name: 'text-3xl',
			size: '1.875rem',
			height: '2.25rem'
		},
		{
			name: 'text-4xl',
			size: '2.25rem',
			height: '2.5rem'
		},
		{
			name: 'text-5xl',
			size: '3rem',
			height: '1'
		},
		{
			name: 'text-6xl',
			size: '3.75rem',
			height: '1'
		},
		{
			name: 'text-7xl',
			size: '4.5rem',
			height: '1'
		},
		{
			name: 'text-8xl',
			size: '6rem',
			height: '1'
		},
		{
			name: 'text-8xl',
			size: '8rem',
			height: '1'
		}
	];

	const isFullSelection = (rte: RichTextEditor) => {
		const selection: Selection = rte.selection();
		const text = selection.toString();

		const result =
			text.length == selection.anchorNode.textContent.trim().length || text.length == 0;
		return result;
	};

	const changeFontSize = (rte: RichTextEditor, font) => {
		if (isFullSelection(rte)) {
			component.setStyle({ 'font-size': font.size, 'line-height': font.height });
		} else {
			rte.insertHTML(
				`<span style="font-size:${font.size};line-height:${
					font.height
				};">${rte.selection()}</span>`,
				{ select: true }
			);
		}
	};
	const rgba2hex = (rgba) =>
		`#${rgba
			.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
			.slice(1)
			.map((n, i) =>
				(i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
					.toString(16)
					.padStart(2, '0')
					.replace('NaN', '')
			)
			.join('')}`;

	const activeFont = () => {
		console.log(rte.selection());
		const node = rte.selection().baseNode.parentElement;
		const size = parseFloat(getComputedStyle(node)['font-size']) * 0.0625 + 'rem';
		return size;
	};

	const getStyles = () => {
		console.log(rte.selection());
		const node = rte.selection().baseNode.parentElement;
		return getComputedStyle(node);
	};
	const changeColor = (style, color) => {
		if (isFullSelection(rte)) {
			component.setStyle({ [style]: color });
		} else {
			rte.insertHTML(`<span style="${style}:${color}">${rte.selection()}</span>`);
		}
	};
</script>

{#if active}
	<span
		use:portal={'.gjs-rte-toolbar'}
		transition:fade={{ duration: 200 }}
		bind:this={toolbar}
		class="z-[2] flex bg-blue-600"
	>
		<Button
			depressed
			fab
			size="x-small"
			class="!bg-transparent !text-white"
			active={queryCommand('bold')}
			on:click={() => $editor.Canvas.getDocument().execCommand('bold')}
		>
			<strong class="text-base">B</strong>
		</Button>
		<Button
			depressed
			fab
			size="x-small"
			class="!bg-transparent !text-white"
			active={queryCommand('italic')}
			on:click={() => $editor.Canvas.getDocument().execCommand('italic')}
		>
			<i class="text-base">I</i>
		</Button>
		<Button
			depressed
			fab
			size="x-small"
			class="!bg-transparent !text-white"
			active={queryCommand('underline')}
			on:click={() => $editor.Canvas.getDocument().execCommand('underline')}
		>
			<u class="text-base">U</u>
		</Button>
		<Button
			depressed
			fab
			size="x-small"
			class="!bg-transparent !text-white"
			active={queryCommand('strikeThrough')}
			on:click={() => $editor.Canvas.getDocument().execCommand('strikeThrough')}
		>
			<strike class="text-base">S</strike>
		</Button>
		<Button
			depressed
			fab
			size="x-small"
			class="!bg-transparent !text-white"
			active={rte.selection() && isValidTag(rte)}
			on:click={() => toggleLink(rte)}
		>
			<Icon size="18" path={Link} />
		</Button>
		<Button
			depressed
			fab
			size="x-small"
			class="!bg-transparent !text-white"
			active={rte.selection() && isValidTag(rte, 'SPAN')}
			on:click={() => toggleSpan(rte)}
		>
			<Icon size="18" path={Brush} />
		</Button>
		<Menu active={active && false}>
			<Button slot="activator" depressed fab size="x-small" class="!bg-transparent !text-white">
				<Icon size="18" path={FormatSize} />
			</Button>

			<span>
				<List dense>
					{@const currentSize = activeFont()}
					{#each fonts as font}
						<ListItem active={currentSize == font.size} on:click={() => changeFontSize(rte, font)}
							>{font.name}</ListItem
						>
					{/each}
				</List>
			</span>
		</Menu>

		<Menu closeOnClick={false} closeOnClickOutside={true}>
			{@const color = rgba2hex(getStyles()['color'])}

			<Button slot="activator" depressed fab size="x-small" class="!bg-transparent !text-white">
				<Icon size="18" path={FormatColorText} />
			</Button>

			<span class="color-picker text-black">
				<ColorPicker
					value={color}
					bind:colors={$colors}
					on:change={({ detail }) => changeColor('color', detail.hex)}
				/>
			</span>
		</Menu>

		<Menu closeOnClick={false}>
			{@const color = rgba2hex(getStyles()['background-color']).slice(0, 7)}

			<Button slot="activator" depressed fab size="x-small" class="!bg-transparent !text-white">
				<Icon size="18" path={FontDownload} />
			</Button>

			<span class="color-picker text-black">
				<ColorPicker
					value={color}
					bind:colors={$colors}
					on:change={({ detail }) => changeColor('background-color', detail.hex)}
				/>
			</span>
		</Menu>
	</span>
{/if}

<style>
	:global(.gjs-rte-toolbar) {
		top: 40px;
	}
	:global(#gjs-tools .gjs-rte-actionbar) {
		display: none !important;
	}
	:global(.color-picker .alpha) {
		background-repeat: repeat;
	}
	:global(.color-picker .wrapper) {
		background-color: transparent;
		border: 0px;
	}
</style>
