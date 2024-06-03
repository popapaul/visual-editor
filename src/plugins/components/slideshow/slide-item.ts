import type { Component, Editor } from 'grapesjs';
export default (editor: Editor) => {
	editor.Components.addType('slide', {
		isComponent: (el) => el?.tagName === 'SLIDE-ITEM',
		model: {
			defaults: {
				draggable: 'slide-show',
				droppable: true,
				type: 'slide',
				priority: 0,
				persistable: true,
				traits: [
					{
						type: 'number',
						name: 'index',
						label: 'Index',
						text: 'Change position of the slide, starts from 0',
						changeProp: true
					}
				]
			},
			init() {
				this.listenTo(this, 'change:index', (model: Component, index) => {
					const slideshow = model.closestType('slideshow');
					if (!slideshow || !slideshow.is('slideshow')) return;
					const slides = slideshow.findType('slide');
					index = Math.max(Math.min(Number(index), slides.length - 1), 0);
					model.move(slideshow, { at: index });
				});
			}
		},
		view: {
			init() { }
		}
	});
};
