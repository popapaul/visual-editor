<script lang="ts">
	import { getContext } from 'svelte';
	import IconPicker from '$modules/core/components/Inputs/IconPicker.svelte';
	import type { Writable } from 'svelte/store';
	import type { Component, Editor } from 'grapesjs';
	let active = false;
	let selectedIcon: Component;
	const editor = getContext<Writable<Editor>>('editor');

	$editor.Commands.add('open-icons', () => {
	
		selectedIcon = $editor.getSelected();
	
		active = true;
	});

	const changeIcon = (event) => {
		
		if (selectedIcon.is('svg')) {

			const attributes = selectedIcon.attributes.attributes;

			const cssClass = selectedIcon.getClasses();
			const id = selectedIcon.id;
			selectedIcon = selectedIcon.replaceWith(event.detail)?.[0] as unknown as Component;
			delete attributes.viewBox;
			selectedIcon.id = id;
			selectedIcon.addAttributes(attributes);
			selectedIcon.setClass(cssClass);
			return;
		}

		const attributes = selectedIcon.findType('svg')?.[0]?.attributes.attributes;
		selectedIcon.components(event.detail);
		const svg = selectedIcon.findType('svg')?.[0];
		if (svg) {
			svg.setAttributes(attributes);
		}
	};
</script>


<IconPicker on:change={changeIcon} bind:active><span></span></IconPicker>

	

