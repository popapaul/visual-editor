const sizes = [350, 500, 800, 1200, 1400, 1980];
const breakpoints = [10, 640, 768, 1024, 1280, 1536];
import type { Component, Editor } from 'grapesjs';

const setSizes = (model: Component, editor: Editor, device) => {
	const mediaWidth = parseInt(device.attributes.widthMedia) || 1920;
	setTimeout(() => {
		if (device.id != editor.Devices.getSelected().id) return;
		const canvasWidth = editor.Canvas.getBody().clientWidth;
		const img = model.getEl() as HTMLImageElement;

		const procentage = Math.round((img.clientWidth / canvasWidth) * 100);
		model.addAttributes({ [`w-${mediaWidth}`]: procentage });

		const widths = img.getAttributeNames().filter((x) => x.startsWith('w-'));

		const sizesMap = new Map<string, { media: number; procentage: string }>();
		widths
			.map((x) => ({ media: parseInt(x.replace('w-', '')), procentage: img.getAttribute(x) }))
			.sort((a, b) => a.media - b.media)
			.forEach((size) => sizesMap.set(size.procentage, size));
		const sizes = Array.from(sizesMap)
			.map(([_, { media, procentage }]) =>
				media == 1920 ? `${procentage}vw` : `(max-width: ${media}px) ${procentage}vw`
			)
			.join(',');
		model.addAttributes({ sizes });
	}, 400);
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
						type: 'select',
						label: 'Lazy Load',
						name: 'loading',
						options: [
							{
								name: 'Lazy',
								value: 'lazy'
							},
							{
								name: 'Eager',
								value: 'eager'
							}
						]
					}
				],
				attributes: {
					loading: 'lazy'
				}
			}
		},

		view: {
			onError() {
				this.model.addClass('empty-img');
			},
			onLoad() {
				const model: Component = this.model;
				model.removeClass('empty-img');
				const img = model.getEl() as HTMLImageElement;
				const src = img.getAttribute('src');

				if (!img) return;
				model.addAttributes({ width: img.naturalWidth, height: img.naturalHeight });
				model.addAttributes({
					srcset: sizes.map((size) => `${src}?format=webp&width=${size} ${size}w`).join(',')
				});
			},
			init() {
				const model: Component = this.model;
				const img = model.getEl() as HTMLImageElement;

				editor.on('device:select', (device) => setSizes(model, editor, device));
			},
			onRender() {
				const model: Component = this.model;
				const device = editor.Devices.getSelected();
				setSizes(model, editor, device);
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
