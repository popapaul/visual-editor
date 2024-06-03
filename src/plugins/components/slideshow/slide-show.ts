import type { Editor } from 'grapesjs';
const slideshow = (editor: Editor) => {
	editor.Components.addType('slide-show', {
		isComponent: (el) => el.tagName === 'SLIDE-SHOW',
		model: {
			defaults: {
				draggable: true,
				droppable: 'slide-item',
				resizable: true,
				persistable: true,
				mouse: 'on',
				direction: 'x',

				speed: 3000,
				autoplay: 'off',
				loop: 'off',

				pagination: 'on',
				navigation: 'on',

				// Define traits, in order to change your properties
				traits: [
					{
						type: 'text',
						name: 'id',
						label: 'Id'
					},
					{
						type: 'select',
						name: 'autoplay',
						label: 'Autoplay',
						default: 'off',
						options: [
							{ value: 'off', name: 'Off' },
							{ value: 'on', name: 'On' }
						]
					},

					{
						type: 'select',
						name: 'navigation',
						label: 'Navigare',
						default: 'off',
						options: [
							{ value: 'off', name: 'Off' },
							{ value: 'on', name: 'On' }
						]
					},
					{
						type: 'select',
						name: 'pagination',
						default: 'off',
						label: 'Paginatie',
						options: [
							{ value: 'off', name: 'Off' },
							{ value: 'on', name: 'On' }
						]
					},
					{
						type: 'select',
						name: 'loop',
						label: 'Loop',
						default: 'off',
						changeProp: true,
						options: [
							{ value: 'off', name: 'Off' },
							{ value: 'on', name: 'On' }
						]
					},
					{
						type: 'number',
						label: 'Durata',
						name: 'speed',
						changeProp: true
					}
				]
			}
		}
	});
};

export default slideshow;
