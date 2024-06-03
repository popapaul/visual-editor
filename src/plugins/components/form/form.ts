import type { Editor } from 'grapesjs';
export default function (editor: Editor) {
	editor.Components.addType('form', {
		isComponent: (el) => el.matches?.('enhanced-form'),
		model: {
			defaults: {
				removable: true,
				// Indicates if it's possible to drag the component inside other
				// Tip: Indicate an array of selectors where it could be dropped inside
				draggable: true,

				// Indicates if it's possible to drop other components inside
				// Tip: Indicate an array of selectors which could be dropped inside
				droppable: true,

				// Set false if don't want to see the badge (with the name) over the component
				badgable: true,

				// True if it's possible to style it
				// Tip:  Indicate an array of CSS properties which is possible to style
				stylable: true,

				// Highlightable with 'dotted' style if true
				highlightable: true,

				// True if it's possible to clone the component
				copyable: true,

				// Indicates if it's possible to resize the component (at the moment implemented only on Image Components)
				// It's also possible to pass an object as options for the Resizer
				resizable: false,

				// Allow to edit the content of the component (used on Text components)
				editable: false,

				// Hide the component inside Layers
				layerable: true,
				styles: null,

				traits: [
					{
						type: 'text',
						label: 'Action',
						name: 'action'
					},
					{
						type: 'text',
						label: 'Method',
						name: 'method'
					}
				]
			}
		}
	});
}
