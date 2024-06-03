<script lang="ts">
	import {
		Button,
		Card,
		Dialog,
		Divider,
		ExpansionPanel,
		ExpansionPanels,
		Icon
	} from '@paulpopa/svelte-material';
	import { Apps, Close, Edit } from '@paulpopa/icons/md/filled';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Block, Editor } from 'grapesjs';

	const editor = getContext<Writable<Editor>>('editor');
	export let culture: string;

	let templates = [];

	let editTemplate;
	let blockDictionary: { [Key: string]: Block[] } = {};

	let dragStart: (block: Block) => void;
	let dragStop: (block: Block) => void;

	const createBlock = () => {
		const model = $editor.getSelected();
		const editorCss = $editor.getCss({ component: model, onlyMatched: true }) as string;
		const html = model.toHTML();
	};

	$editor.Commands.add('create-block', createBlock);

	$editor.on('block:custom', (props) => {
		({ dragStart, dragStop } = props);
		// The `props` will contain all the information you need in order to update your UI.
		// props.blocks (Array<Block>) - Array of all blocks
		// props.dragStart (Function<Block>) - A callback to trigger the start of block dragging.
		// props.dragStop (Function<Block>) - A callback to trigger the stop of block dragging.
		// props.container (HTMLElement) - The default element where you can append your UI

		// Here you would put the logic to render/update your UI.

		blockDictionary = props.blocks.reduce((acc: { [Key: string]: Block[] }, block: Block) => {
			const category = block.getCategoryLabel();
			acc[category] ??= [];
			acc[category].push(block);
			return acc;
		}, {});
	});

	const setBlocks = async () => {
		setTimeout(() => $editor.render(), 100);
	};

	$: culture && setBlocks();

	const remove = (template) => {
		templates = templates.filter((x) => x.id == template.id);
		editTemplate = null;
	};

	const save = (template) => {
		const locale = template?.templates?.find((x) => x.culture == culture);
		if (locale) return;

		templates = templates.filter((x) => x.id == template.id);
		templates = [...templates, locale];
		editTemplate = null;
	};
</script>

<ExpansionPanels multiple>
	{#each Object.entries(blockDictionary) as [category, blocks]}
		<ExpansionPanel contentClass="!px-1">
			<span slot="header">{category || 'Extra'}</span>

			<div class="flex w-full flex-wrap">
				{#each blocks as block}
					{@const template = templates.find((x) => x.id.toString() == block.getId())}

					<div class="relative m-1 block" style="flex:1 0 100px">
						{#if template}
							<Button
								fab
								depressed
								size="x-small"
								href="/backend/editor/{culture}/{template.id}"
								class="block-remove absolute right-0 top-0 text-white opacity-0 transition-opacity">
								<Icon path={Edit} />
							</Button>
						{/if}
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							class="gjs-one-bg gjs-four-color-h !w-full cursor-grab pb-2 pt-4 transition-colors"
							on:dragstart={() => dragStart(block)}
							on:dragend={() => dragStop(block)}
							title={block.getLabel()}
							draggable="true">
							<div class="gjs-block__media">
								{@html block.getMedia() || Apps}
							</div>
							<div class="text-center text-sm">{block.getLabel()}</div>
						</div>
					</div>
				{/each}
			</div>
		</ExpansionPanel>
	{/each}
</ExpansionPanels>

<Dialog class="h-full" width="80vw" active={!!editTemplate} on:close={() => (editTemplate = null)}>
	<Card class="h-full">
		<div class="flex h-full flex-col px-[24px] pt-2">
			<div class="relative flex w-full items-center gap-10 pb-2 pt-3">
				<span>Blocks</span>
				<Button class="!ml-auto" size="large" icon on:click={() => (editTemplate = null)}>
					<Icon path={Close} />
				</Button>
			</div>
			<Divider class="mb-4" />
		</div>
	</Card>
</Dialog>

<style>
	:global(.block:hover button) {
		opacity: 1;
	}
</style>
