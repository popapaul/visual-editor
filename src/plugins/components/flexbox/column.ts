import type { Editor } from 'grapesjs';
const styleClm = `
.column:empty{
    min-height: 50px;
}
    .column {
      min-height: 20px;
      flex-grow: 1;
      padding:5px;
      flex-basis: 100%;
    }`;
const keyWidth = 'flex-basis';
const step = 2;
const minDim = 1;
const currentUnit = 1;
const resizerBtm = { tl: 0, tc: 0, tr: 0, cl: 1, cr: 0, bl: 0, br: 0, minDim };
const resizerRight = { ...resizerBtm, cr: 1, bc: 0, keyWidth, currentUnit, minDim, step };

export default function (editor: Editor) {
	editor.Components.addType('column', {
		isComponent: (el) => el.matches?.('div.column'),
		model: {
			defaults: {
				removable: true,
				// Indicates if it's possible to drag the component inside other
				// Tip: Indicate an array of selectors where it could be dropped inside
				draggable: (_, destination) => destination.get('type') === 'row',

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
				resizable: resizerRight,

				// Allow to edit the content of the component (used on Text components)
				editable: false,

				// Hide the component inside Layers
				layerable: true,
				styles: styleClm,

				traits: []
			}
		}
	});
}
