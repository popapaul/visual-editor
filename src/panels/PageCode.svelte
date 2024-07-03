<script lang="ts">
	import { formatHtml } from '$utils/purifycss';
	import {
		Button,
		ButtonGroup,
		ButtonGroupItem,
		Card,
		CardText,
		Icon,
		Dialog
	} from '@paulpopa/svelte-material';
	import { Close } from '@paulpopa/icons/md/filled';
	import { persisted } from 'svelte-persisted-store';
	import { CodeMirror } from '@paulpopa/codemirror';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Editor } from 'grapesjs';
	import { client } from '$client/trpc';

	let panels = persisted('codePanels', ['html', 'css']);
	let css: string;
	let html: string;
	let js: string;
	let active = false;

	const editor = getContext<Writable<Editor>>('editor');
	const getCode = async () => {
		const doc = $editor.Canvas.getDocument();
		let twcss = Array.from(doc.head.querySelectorAll('style')).reduce(
			(acc, el) => (el.innerText.includes('--tw') ? acc + el.innerText : acc),
			''
		);

		const editorCss = $editor.getCss({ avoidProtected: true }) as string;
		html = formatHtml($editor.DomComponents.getWrapper().getInnerHTML());

		[twcss] = await client.records.purifyCSS.mutate({ html, css: twcss });
		css = editorCss;
	};

	const saveChanges = () => {
		const pageManager = $editor.Pages;
		const page = pageManager.getSelected();
		const component = page.getMainComponent();
		component.components(html.trim());
		$editor.setStyle(css);

		active = false;
	};

	$: active && getCode();
</script>

<Dialog class="h-full overflow-hidden" width="95vw" height="90vh" bind:active>
	<slot slot="activator" />
	<Card shaped class="!grid h-full flex-col" style="grid-template-rows:auto 1fr;">
		<div class="relative flex justify-between px-4 pt-3">
			<Button class="success-color" on:click={saveChanges} depressed>Save</Button>

			<ButtonGroup multiple mandatory activeClass="primary-color" bind:value={$panels}>
				<ButtonGroupItem value="html">HTML</ButtonGroupItem>
				<ButtonGroupItem value="css">CSS</ButtonGroupItem>
			</ButtonGroup>

			<Button icon on:click={() => (active = !active)}>
				<Icon path={Close} />
			</Button>
		</div>
		<CardText class=" flex w-full grow gap-4 overflow-auto !pb-0">
			{#if $panels.includes('html')}
				<div class="mb-5 flex grow basis-0 flex-col overflow-hidden">
					<span class="mb-1">HTML</span>
					<CodeMirror class="w-full grow overflow-auto" mode="HTML" bind:value={html} />
				</div>
			{/if}

			{#if $panels.includes('css')}
				<div class="mb-5 flex grow basis-0 flex-col overflow-hidden">
					<span class="mb-1">CSS</span>
					<CodeMirror class="w-full grow overflow-auto" mode="CSS" bind:value={css} />
				</div>
			{/if}

			{#if $panels.includes('js')}
				<div class="mb-5 flex grow basis-0 flex-col overflow-hidden">
					<span class="mb-1">JS</span>
					<CodeMirror class="w-full grow overflow-auto" mode="JS" bind:value={js} />
				</div>
			{/if}
		</CardText>
	</Card>
</Dialog>
