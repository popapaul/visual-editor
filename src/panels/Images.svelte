<script lang="ts">
	import { getContext } from 'svelte';
	import { FilePicker } from '$modules/core/components';
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

	const changeImage = (value) => {
		const { attribute, style } = options;
		if (attribute) selectedImage.addAttributes({ [attribute]: value });
		if (style)
			selectedImage.setStyle({
				background: `url(${value}); background-repeat:no-repeat; background-size:cover;`
			});
	};
</script>

{#if type}
	<FilePicker path={[type]} bind:active onChange={changeImage} />
{/if}
