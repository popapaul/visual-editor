<script lang="ts">
	import { Button, Icon, List, ListItem, Menu, Tooltip, portal } from '@paulpopa/svelte-material';
	import { Move } from '@paulpopa/icons/fi';
	import { ContentCopy, Delete, KeyboardArrowUp, GridView, Link } from '@paulpopa/icons/md/filled';
	import { LL } from '$i18n';
	import { getContext, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Writable } from 'svelte/store';
	import type { Component, Editor } from 'grapesjs';
	const editor = getContext<Writable<Editor>>('editor');
	let selected: Component;

	const onSelect = async (model: Component) => {
		//await new Promise((resolve) => setTimeout(resolve, 10));
		await tick();
		selected = model;
	};

	const onRemove = (model: Component) => {
		if (model == selected) selected = null;
	};

	$editor.on('component:drag:start', () => (selected = null));
	$editor.on('component:drag:end', ({ target }) => onSelect(target));
	$editor.on('component:selected', onSelect);
	//$editor.on('component:deselected', () => (selected = null));
	$editor.on('component:remove', onRemove);

	let toolbar;

	const WrapInLink = (model: Component) => {
		const index = model.index();
		const parent = model.parent();

		parent.append(`<a target="_self" class="contents"></a>`, { at: index });
		const anchor = parent.getChildAt(index);
		model.move(anchor, { at: 0 });

		$editor.selectToggle(model);
		$editor.selectToggle(model);
	};

	const changeDragMode = (mode: 'absolute' | 'translate' | '') => {
		if (!selected) return;
		selected.setStyle({ ...selected.getStyle(), top: '', left: '', position: '', transform: '' });
		selected.setDragMode(mode);
	};
</script>

{#if selected}
	{@const parent = selected?.parent()}
	{@const anchor = selected.closest('a')}
	{#key selected.getId() + parent?.getId?.()}
		<span
			use:portal={'.gjs-toolbar'}
			bind:this={toolbar}

			in:fade={{ duration: 200 }}
			class="z-[2] flex bg-blue-500">
			{#if !anchor}
				<Tooltip>
					<Button
						class="!bg-transparent !text-white"
						depressed
						fab
						size="x-small"
						on:click={() => WrapInLink(selected)}>
						<Icon size="18" path={Link} />
					</Button>
					<div slot="tip">{$LL.cms.WrapInLink()}</div>
				</Tooltip>
			{/if}

			{#if parent}
				<Tooltip>
					<Button
						class="!bg-transparent !text-white"
						depressed
						fab
						size="x-small"
						on:click={() => $editor.runCommand('core:component-exit', { force: 1 })}>
						<Icon size="18" path={KeyboardArrowUp} />
					</Button>
					<span slot="tip">{$LL.cms.SelectParent()}</span>
				</Tooltip>
			{/if}

			<!-- <Tooltip>
              <Button depressed fab size="x-small" on:click={()=>$$editor.runCommand("edit-script")}> 
                  <Icon size="18" path={Javascript} />
              </Button>
              <span slot="tip">{$LL.cms.Script()}</span>
          </Tooltip> -->

			{#if selected.get('draggable')}
				<Menu hover>
					<div slot="activator">
						<Button
							depressed
							fab
							size="x-small"
							class="!bg-transparent !text-white"
							on:click={() => $editor.runCommand('tlb-move')}>
							<Icon size="18" path={Move} />
						</Button>
					</div>
					<List>
						<ListItem dense on:click={() => selected.setDragMode('translate')}
							>{$LL.cms.DragTranslate()}</ListItem>
						<ListItem dense on:click={() => selected.setDragMode('absolute')}
							>{$LL.cms.DragAbsolute()}</ListItem>
						<ListItem dense on:click={() => changeDragMode('')}>{$LL.cms.DragDefault()}</ListItem>
					</List>
				</Menu>
			{/if}

			{#if selected.get('copyable')}
				<Tooltip>
					<Button
						depressed
						fab
						size="x-small"
						class="!bg-transparent !text-white"
						on:click={() => $editor.runCommand('tlb-clone')}>
						<Icon size="18" path={ContentCopy} />
					</Button>
					<span slot="tip">{$LL.cms.Copy()}</span>
				</Tooltip>
			{/if}

			{#if selected.get('removable')}
				<Tooltip>
					<Button
						depressed
						fab
						size="x-small"
						class="!bg-transparent !text-white"
						on:click={() => $editor.runCommand('tlb-delete')}>
						<Icon size="18" path={Delete} />
					</Button>
					<span slot="tip">{$LL.cms.Delete()}</span>
				</Tooltip>
			{/if}

			<Tooltip>
				<Button
					depressed
					fab
					size="x-small"
					class="!bg-transparent !text-white"
					on:click={() => $editor.runCommand('create-block')}>
					<Icon size="18" path={GridView} />
				</Button>
				<span slot="tip">{$LL.cms.CreateBlock()}</span>
			</Tooltip>
		</span>
	{/key}
{/if}

<style>
	:global(#gjs-tools .gjs-toolbar .gjs-toolbar-items) {
		display: none !important;
	}
</style>
