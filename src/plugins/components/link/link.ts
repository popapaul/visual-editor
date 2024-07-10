import type { Editor } from 'grapesjs';
export default (editor: Editor) => {
	editor.DomComponents.removeType('link');

	editor.DomComponents.addType('link', {
		// Model definition
		isComponent: (el) => el.tagName == 'A',
		extend: 'text',
		model: {
			// Default properties
			defaults: {
				removable: true,
				// Indicates if it's possible to drag the component inside other
				// Tip: Indicate an array of selectors where it could be dropped inside
				draggable: true,

				// Indicates if it's possible to drop other components inside
				// Tip: Indicate an array of selectors which could be dropped inside
				droppable: false,

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
				editable: true,

				// Hide the component inside Layers
				layerable: true,

				traits: [
					{
						type: 'text',
						label: 'Id',
						name: 'id'
					},
					{
						type: 'text',
						label: 'Title',
						name: 'alt'
					},
					{
						type: 'select',
						label: 'Deschidere Link',
						options: [{
							id: "_blank",
							value: "_blank",
							name: "Tab Nou",
						},
						{
							id: "_self",
							value: "_self",
							name: "Tab current",
						}],
						name: 'target'
					},
					{
						type: 'url',
						label: 'Link',
						name: 'href'
					},
					{
						type: 'text',
						label: 'Download',
						name: 'download',
						text: 'UsedWhenLinkPointsToFile'
					}
				]
			}
		}
	});
};
