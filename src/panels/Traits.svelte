<script lang="ts">
	import {
		Button,
		Checkbox,
		ExpansionPanel,
		ExpansionPanels,
		Icon,
		Select,
		TextField
	} from '@paulpopa/svelte-material';
	import { Close, Delete, Image } from '@paulpopa/icons/md/filled';
	import { LL } from '$i18n';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import FilePicker from '$client/cms/Inputs/FilePicker.svelte';
	import SelectFriendlyUrl from '$client/cms/Inputs/SelectFriendlyUrl.svelte';
	import type { Component, Editor, Trait } from 'grapesjs';

	const editor = getContext<Writable<Editor>>('editor');
	function capitalize(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	let selected: Component;

	const onSelect = (model: Component) => {
		selected = model;
	};

	const getParents = (target: Component, list: Component[] = []): Component[] => {
		const parent = target.parent();
		if (parent) return [...list, parent, ...getParents(parent, list)];
		return list;
	};

	const handleChange = (name: string, value, component: Component, trait: Trait) => {
		if (!component) return;

		const attrs = trait.attributes.changeProp ? component.attributes : component.getAttributes();
		if (attrs[name] == value) return;

		if (trait.attributes.changeProp) component.set(name, value);
		else component.addAttributes({ [name]: value });

		component[name] = value?.toString?.();
	};

	const handleBoolean = (name: string, value, component: Component, trait: Trait) => {
		if (!component) return;
		const attrs = component.getAttributes();
		if (value === true) {
			component.addAttributes({ [name]: value.toString() });
			attrs[name] = value;
			return;
		}
		if (value === false) {
			component.removeAttributes([name]);
			return;
		}
		handleChange(name, value, component, trait);
	};
	$editor.on('component:selected', onSelect);
	$editor.on('component:deselected', (selected = null));
</script>

{#key selected}
	{#if selected}
		{@const components = [
			selected,
			selected.closestType('link'),
			...getParents(selected).filter((x) => x.attributes.persistable)
		]}

		{#each components.filter((x) => x) as component, index}
			{@const traits = component.getTraits()}
			{@const categories = [
				...new Set(traits.map((trait) => trait.attributes?.attributes?.category))
			]}

			<ExpansionPanels accordion multiple value={[0]}>
				{#each categories as category, index}
					<ExpansionPanel active value={index}>
						<span slot="header"
							>{capitalize(category || component.attributes?.type || 'Options')}</span
						>
						<div class="mt-2 w-full">
							{#each traits.filter((trait) => trait.attributes?.attributes?.category == category) as trait}
								{@const {
									name,
									type,
									options,
									valueFalse,
									valueTrue,
									text: description,
									label,
									changeProp
								} = trait.attributes}
								{@const hint = $LL[description]() || description || ''}
								{@const attributes = changeProp ? component.attributes : component.getAttributes()}
								{#if type == 'number'}
									<TextField
										{hint}
										type="number"
										value={attributes[name]}
										on:input={(event) => handleChange(name, event.target.value, component, trait)}
									>
										{capitalize(label || name)}</TextField
									>
								{/if}

								{#if type == 'checkbox'}
									<Checkbox
										class="mt-3"
										checked={typeof attributes[name] !== 'undefined'
											? attributes[name].length > 0
												? valueTrue == attributes[name]
												: true
											: false}
										on:change={(event) =>
											handleBoolean(name, event.target.checked, component, trait)}
									>
										{capitalize(label || name)}</Checkbox
									>
								{/if}

								{#if type == 'text'}
									<TextField
										{hint}
										value={attributes[name]}
										on:change={(event) => handleChange(name, event.target.value, component, trait)}
									>
										{capitalize(label || name)}</TextField
									>
								{/if}

								{#if type == 'image'}
									<TextField
										{hint}
										value={attributes[name]}
										on:change={(event) => handleChange(name, event.target.value, component, trait)}
									>
										<FilePicker
											path={['images']}
											on:change={({ detail }) => handleChange(name, '' + detail, component, trait)}
											slot="append-outer"
										>
											<Button size="small" fab depressed>
												<Icon path={Image} />
											</Button>
										</FilePicker>
										{capitalize(label || name)}</TextField
									>
								{/if}

								{#if type == 'select'}
									<Select
										{hint}
										value={attributes[name] ?? trait.attributes.default}
										on:change={({ detail }) => handleChange(name, detail, component, trait)}
										items={options.map((x) => ({
											name: (x?.label ?? x?.name ?? x?.value ?? x) || 'Not set',
											value: x?.value ?? x
										}))}
										>{capitalize(label || name)}
										<Button
											depressed
											fab
											class="!bg-transparent"
											size="x-small"
											slot="append-outer"
											on:click={() => handleChange(name, '', component, trait)}
										>
											<Icon path={Close} />
										</Button>
									</Select>
								{/if}

								{#if type == 'selectTarget'}
									<Select
										{hint}
										class="mt-2 w-full"
										value={attributes[name] ?? '_self'}
										mandatory
										on:change={({ detail }) => handleChange(name, detail, component, trait)}
										items={[
											{ name: 'New Window', value: '_blank' },
											{ name: 'Same Window', value: '_self' }
										]}
										>{capitalize(label || name)}
									</Select>
								{/if}

								{#if type == 'selectFriendlyUrl'}
									<SelectFriendlyUrl
										{hint}
										class="mt-2 w-full"
										pageId={attributes['pageid']}
										value={attributes[name]}
										on:change={({ detail }) => handleChange(name, detail, component, trait)}
										items={options.map((x) => ({
											name: (x?.label ?? x?.name ?? x?.value ?? x) || 'Not set',
											value: x?.value ?? x
										}))}
										>{capitalize(label || name)}
										<Button
											depressed
											fab
											slot="append-outer"
											on:click={() => handleChange(name, '', component, trait)}
										>
											<Icon path={Close} />
										</Button>
									</SelectFriendlyUrl>
								{/if}
							{/each}
							<Button
								depressed
								class="mt-2 w-full"
								on:click={() => {
									component.remove();
									selected = null;
									$editor.selectRemove(selected);
								}}
							>
								<Icon class="mr-2" path={Delete} />
								{$LL['Remove ' + component.attributes.type] ||
									'Remove ' + component.attributes.type}
							</Button>
						</div>
					</ExpansionPanel>
				{/each}
			</ExpansionPanels>
		{/each}
	{/if}
{/key}
