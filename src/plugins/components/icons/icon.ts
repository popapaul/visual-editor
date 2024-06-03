import type { Editor } from 'grapesjs';
export default (editor: Editor) => {
	// editor.DomComponents.addType('icon', {
	// 	// Model definition
	// 	isComponent: (el) => el?.matches?.(`icon`),
	// 	model: {
	// 		// Default properties
	// 		defaults: {
	// 			removable: true,
	// 			// Indicates if it's possible to drag the component inside other
	// 			// Tip: Indicate an array of selectors where it could be dropped inside
	// 			draggable: true,

	// 			// Indicates if it's possible to drop other components inside
	// 			// Tip: Indicate an array of selectors which could be dropped inside
	// 			droppable: false,

	// 			// Set false if don't want to see the badge (with the name) over the component
	// 			badgable: true,

	// 			// True if it's possible to style it
	// 			// Tip:  Indicate an array of CSS properties which is possible to style
	// 			stylable: true,

	// 			// Highlightable with 'dotted' style if true
	// 			highlightable: true,

	// 			// True if it's possible to clone the component
	// 			copyable: true,

	// 			// Indicates if it's possible to resize the component (at the moment implemented only on Image Components)
	// 			// It's also possible to pass an object as options for the Resizer
	// 			resizable: false,

	// 			// Allow to edit the content of the component (used on Text components)
	// 			editable: false,

	// 			// Hide the component inside Layers
	// 			layerable: true
	// 		}
	// 	}
	// });

	editor.DomComponents.removeType('svg');

	editor.DomComponents.addType('svg', {
		// Model definition
		isComponent: (el) => el?.tagName?.toLowerCase?.() == 'svg',
		model: {
			// Default properties
			defaults: {
				selectable: true,
				hoverable: true,
				layerable: true,
				resizable: true,
				highlightable: true,
				badgable: true
			}
		},
		view: {
			events: () => ({
				dblclick: function () {
					editor.runCommand('open-icons', { el: this?.model?.parent?.() });
				}
			}),
			_createElement: function (tagName: any) {
				return document.createElementNS('http://www.w3.org/2000/svg', tagName);
			}
		}
	});

	editor.DomComponents.addType('svg-inner', {
		// Model definition
		isComponent: (el) => el?.parentElement?.tagName?.toLowerCase?.() == 'svg',
		model: {
			// Default properties
			defaults: {
				selectable: false,
				hoverable: false,
				layerable: false,
				highlightable: false,
				badgable: false
			}
		},
		view: {
			_createElement: function (tagName: any) {
				return document.createElementNS('http://www.w3.org/2000/svg', tagName);
			}
		}
	});
};
