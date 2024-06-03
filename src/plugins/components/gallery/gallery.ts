import type { Editor } from 'grapesjs';
export default (editor: Editor) =>
	editor.Components.addType('gallery', {
		isComponent: (el) => el.tagName === 'LIGHTBOX-GALLERY',
		model: {
			defaults: {
				droppable: true,
				resizable: true,
				traits: [
					{
						type: 'checkbox',
						name: 'true_order',
						label: 'Force Order'
					},
					{
						type: 'number',
						name: 'margin',
						label: 'Margin',
						changeProp: true
					},
					{
						type: 'checkbox',
						name: 'waitforimages',
						label: 'Lazyload',
						changeProp: true
					},
					{
						type: 'number',
						name: 'desktop',
						changeProp: true,
						label: 'Desktop'
					},
					{
						type: 'number',
						name: 'laptop',
						changeProp: true,
						label: 'Laptop'
					},
					{
						type: 'number',
						name: 'tablet',
						changeProp: true,
						label: 'Tablet'
					},
					{
						type: 'number',
						name: 'mobile_portrait',
						changeProp: true,
						label: 'Mobile'
					}
				]
			}
		},
		view: {}
	});
