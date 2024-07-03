

import type { Component, Editor } from 'grapesjs';

const setProcentageWidth = (model: Component, editor: Editor) => {
	const canvasWidth = editor.Canvas.getBody().clientWidth;
	const img = model.getEl() as HTMLImageElement;
	if (!img) return;
	model.addAttributes({ size: Math.round((img.clientWidth / canvasWidth) * 100) });
};

export const image = (editor: Editor) => {
	editor.DomComponents.removeType('image');
	editor.DomComponents.addType('image', {
		isComponent: (el) => el.tagName === 'IMG',
		model: {
			defaults: {
				tagName: 'img',
				droppable: false,
				hoverable: true,
				'stylable-require': ['object-fit', 'object-position'],
				resizable: { keepAutoHeight: true },
				traits: [
					{
						type: 'text',
						label: 'Alt',
						name: 'alt'
					},
					{
						type: 'text',
						label: 'Src',
						name: 'src'
					},
					{
						type: 'number',
						label: 'Marime(%)',
						name: 'size'
					},
					{
						type: 'number',
						label: 'Quality(%)',
						name: 'quality'
					},
					{
						type: 'select',
						label: 'Lazy Load',
						name: 'loading',
						options: [
							{
								id: "lazy",
								name: 'Lazy',
								value: 'lazy'
							},
							{
								id: 'eager',
								name: 'Eager',
								value: 'eager'
							}
						]
					}
				],
				attributes: {
					loading: 'lazy'
				}
			},
		},

		view: {
			onError() {
				this.model.addClass('empty-img');
			},
			onLoad() {
				const model: Component = this.model;
				model.removeClass('empty-img');
				setProcentageWidth(model, editor)
			},
			events: () => ({
				dblclick: 'onActive',
				error: 'onError',
				load: 'onLoad'
			}),
			onActive() {
				editor.Commands.run('open-assets', { type: 'images', attribute: 'src' });
			}
		}
	});
};
