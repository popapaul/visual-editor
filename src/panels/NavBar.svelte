<script lang="ts">
	import { LL } from '$i18n';
	import { persisted } from 'svelte-persisted-store';
	import {
		Icon,
		ButtonGroup,
		ButtonGroupItem,
		AppBar,
		Button,
		Tooltip
	} from '@paulpopa/svelte-material';
	import { FileCode } from '@paulpopa/icons/fa/regular';

	import { Brush, Apps, CheckBoxOutlineBlank } from '@paulpopa/icons/md/filled';
	import { getContext } from 'svelte';
	import PageCode from './PageCode.svelte';

	import type { Writable } from 'svelte/store';
	import type { Editor } from 'grapesjs';
	import { devices } from '../managers/DeviceManager';
	import { Fullscreen, Layers } from '@paulpopa/icons/md/outlined';

	const panels = persisted('editor-panels', { left: [], right: [] });

	const editor = getContext<Writable<Editor>>('editor');

	let outline = persisted('editor-outline', true);
	let fullscreen = false;

	const handleFullScreen = () => {
		fullscreen = !fullscreen;
		const container = $editor.getContainer().parentElement;

		if (fullscreen) return container.requestFullscreen();
		document.exitFullscreen();
	};

	const toggleOutline = (outline) => {
		const canvas = $editor.getWrapper();

		if (!canvas) return;

		if (outline) canvas.addClass('gjs-dashed');
		else canvas.removeClass('gjs-dashed');
	};

	$: toggleOutline($outline);
</script>

<svelte:document on:fullscreenchange={() => !document.fullscreenElement && (fullscreen = false)} />

<AppBar style="grid-area:toolbar">
	<ButtonGroup borderless activeClass="primary-color" bind:value={$panels.left}>
		<ButtonGroupItem value="layers" on:click>
			<Tooltip>
				<Icon path={Layers} />
				<span slot="tip">{$LL.cms.Layers()}</span>
			</Tooltip>
		</ButtonGroupItem>
	</ButtonGroup>

	<div  class="mx-auto">
	<ButtonGroup mandatory borderless value="desktop">
		{#each devices as { id, icon, widthMedia }}
			<Tooltip>
				<ButtonGroupItem activeClass="primary-color"  value={id} on:click={() => $editor.setDevice(id)}>
					<Icon path={icon} />
				</ButtonGroupItem>

				<span slot="tip">
					{#if widthMedia}
						Max {widthMedia}
					{/if}
				</span>
			</Tooltip>
		{/each}
	</ButtonGroup>
</div>

	<PageCode>
		<Tooltip>
			<Button class="primary-color mx-1">
				<Icon path={FileCode} />
			</Button>
			<span slot="tip">Page HTML/CSS</span>
		</Tooltip>
	</PageCode>

	<div class="flex gap-2 mx-auto">
		<Tooltip>
			<Button
				fab
				size="small"
				active={$outline}
				depressed
				activeClass="primary-color"
				class="mx-1"
				on:click={() => ($outline = !$outline)}
			>
				<Icon path={CheckBoxOutlineBlank} />
			</Button>
			<span slot="tip">Toggle Outline</span>
		</Tooltip>
		<Tooltip>
			<Button
				fab
				size="small"
				active={fullscreen}
				depressed
				activeClass="primary-color"
				class="mx-1"
				on:click={handleFullScreen}
			>
				<Icon path={Fullscreen} />
			</Button>
			<span slot="tip">Fullscreen</span>
		</Tooltip>
	</div>


	<ButtonGroup borderless activeClass="primary-color" bind:value={$panels.right}>
		<Tooltip>
			<ButtonGroupItem value="styles">
				<Icon path={Brush} />
			</ButtonGroupItem>
			<span slot="tip">{$LL.cms.Styles()}</span>
		</Tooltip>

		<Tooltip>
			<ButtonGroupItem value="blocks">
				<Icon path={Apps} />
			</ButtonGroupItem>
			<span slot="tip">{$LL.cms.Blocks()}</span>
		</Tooltip>
	</ButtonGroup>
</AppBar>
