<script lang="ts">
	import {
		Button,
		Checkbox,
		ExpansionPanel,
		ExpansionPanels,
		Icon,
		Select,
		Textarea,
		TextField
	} from '@paulpopa/svelte-material';
	import { Close, Delete, Image } from '@paulpopa/icons/md/filled';
	import { LL } from '$i18n';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import {FilePicker} from '$modules/core/components';

	import SelectFriendlyUrl from '$modules/core/components/Inputs/SelectFriendlyUrl.svelte';
	import type { Component, Editor, Trait } from 'grapesjs';
	import { debounce } from '$utils/debounce';

	const editor = getContext<Writable<Editor>>('editor');
	function capitalize(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	let components: Component[] = [];

	const onSelect = (model: Component) => {
		components = model
			? [
					model,
					model.closestType('link'),
					...getParents(model).filter((x) => x.attributes.persistable)
				]
			: [];
	};

	const getParents = (target: Component, list: Component[] = []): Component[] => {
		const parent = target.parent();
		if (parent) return [...list, parent, ...getParents(parent, list)];
		return list;
	};

	const handleChange = (name: string, value: any, component: Component) => {
		console.log(value)
		if (!component) return;

		if (value === false) component.removeAttributes([name]);
		else component.addAttributes({ [name]: value });

		const index = components.findIndex((x) => x == component);
		if (index >= 0) components[index].attributes.attributes[name] = value;
	};

	const deboucedUpdate = debounce(handleChange, 250);

	$editor.on('component:selected', onSelect);
	$editor.on('component:deselected', () => (components = []));
</script>

{#each components.filter((x) => x) as component, index}
	{@const traits = component.getTraits()}
	{@const categories = [...new Set(traits.map((trait) => trait.attributes?.attributes?.category))]}

	<ExpansionPanels accordion multiple value={[0]}>
		{#each categories as category, index}
			<ExpansionPanel active value={index}>
				<span slot="header">{capitalize(category || component.attributes?.type || 'Options')}</span>
				<div class="mt-2 flex flex-col w-full">
					{#each traits.filter((trait) => trait.attributes?.attributes?.category == category) as trait}
						{@const {
							name,
							type,
							options,
							attributes: metadata,
							text: description,
							label
						} = trait.attributes}
						{@const hint = $LL[description]() || description || ''}
						{@const value = component?.attributes?.attributes?.[name]}
						{#if type == 'number'}
							<TextField
								{hint}
								type="number"
								{value}
								on:input={(event) => deboucedUpdate(name, event.target.value, component)}
							>
								{capitalize(label || name)}</TextField
							>
						{/if}

						{#if type == 'checkbox' || type == 'boolean'}
							<Checkbox
								class=""
								checked={Boolean(value)}
								on:change={(event) =>
									handleChange(name, event.target.checked ? 'true' : false, component)}
							>
								{capitalize(label || name)}</Checkbox
							>
						{/if}

						{#if type == 'text'}
							<TextField
								{hint}
								{value}
								clearable
								on:input={(event) => deboucedUpdate(name, event.target.value, component)}
							>
								{capitalize(label || name)}</TextField
							>
						{/if}

						{#if type == 'textarea'}
							<Textarea
								{hint}
								{value}
								on:input={(event) => deboucedUpdate(name, event.target.value, component)}
							>
								{capitalize(label || name)}</Textarea
							>
						{/if}

						{#if type == 'image' || type == 'file'}
							<div class="flex gap-2 items-center">
								<TextField
									{hint}
									{value}
									clearable
									on:input={(event) => deboucedUpdate(name, event.target.value, component)}
								>
									{capitalize(label || name)}</TextField
								>
								<FilePicker
									accept={metadata.accept}
									path={metadata?.path ?? ['images']}
									onChange={(file) =>{
										handleChange("href", file, component);
										handleChange("download", file.split("/").pop(), component);
										if(name.toLowerCase()!="download")
											handleChange(name, file, component);
									}}
								>
									<Button size="x-small" fab depressed slot="activator">
										<Icon class="!w-5 !h-5" path={Image} />
									</Button>
								</FilePicker>
							</div>
						{/if}

						{#if type == 'select'}
							<Select
								{hint}
								clearable
								value={component.attributes.attributes[name] ?? trait.attributes.default}
								on:change={({ detail }) => handleChange(name, detail, component)}
								on:clear={() => handleChange(name, "", component)}
								items={options.map((x) => ({
									name: (x?.label ?? x?.name ?? x?.value ?? x) || 'Not set',
									value: x?.value ?? x
								}))}
								>{capitalize(label || name)}
							
							</Select>
						{/if}

						{#if type == 'url'}
							<SelectFriendlyUrl
								{hint}
								class="mt-2 w-full"
								{value}
								on:change={({ detail }) => handleChange(name, detail, component)}
								>{capitalize(label || name)}
								<Button
									depressed
									fab
									slot="append-outer"
									on:click={() => handleChange(name, '', component)}
								>
									<Icon path={Close} />
								</Button>
							</SelectFriendlyUrl>
						{/if}
					{/each}
				</div>
			</ExpansionPanel>
		{/each}
	</ExpansionPanels>
{/each}
