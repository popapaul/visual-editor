import slideshow from './slide-show';
import slide from './slide-item';

const slide_item = `<slide-item class="block grow-0 shrink-0 basis-full"><img src="" class="w-full h-full object-cover"/></slide-item>`;
export default function (editor) {
	slideshow(editor);
	slide(editor);

	editor.BlockManager.add('slide-show', {
		label: 'Slideshow',
		attributes: { class: 'fa fa-text' },
		content: `<slide-show class="flex" style="height:500px;">
                        ${slide_item}
                        ${slide_item}
                        ${slide_item}
                </slide-show>`
	});

	editor.BlockManager.add('slide-item', {
		label: 'Slide',
		attributes: { class: 'fa fa-text' },
		content: `${slide_item}`
	});
}
