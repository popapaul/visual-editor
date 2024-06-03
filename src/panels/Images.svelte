<script lang="ts">
	import { getContext } from 'svelte';
	import FilePicker from '$client/cms/Inputs/FilePicker.svelte';
	import type { Writable } from 'svelte/store';
	import type { Component, Editor } from 'grapesjs';

	let active = false;
	let selectedImage: Component;
	let options: { attribute?: string; style?: string };
	let type: string;
	const editor = getContext<Writable<Editor>>('editor');

	$editor.Commands.add('open-assets', (_editor, _sender, props) => {
		options = {
			attribute: props.attribute,
			style: props.style ?? !props.attribute
		};

		type = props.type ?? 'images';
		selectedImage = $editor.getSelected();
		active = true;
	});

	const changeImage = ({ detail }) => {
		const { attribute, style } = options;
		if (attribute) selectedImage.addAttributes({ [attribute]: detail });
		if (style)
			selectedImage.setStyle({
				background: `url(${detail}); background-repeat:no-repeat; background-size:cover;`
			});
	};
</script>

{#if type}
	<FilePicker {type} bind:active on:change={changeImage} />
{/if}
