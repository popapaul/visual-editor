import { List, ListAlt } from "@paulpopa/icons/md/outlined";

export default (editor) => {
	editor.BlockManager.add('list', {
		label: 'List',
		category: 'Basic',
		media: List,
		content: `<ul class="p-2 list-inside list-disc">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        </ul>`
	});

	editor.BlockManager.add('list-item', {
		label: 'List-Item',
		category: 'Basic',
		media: ListAlt,
		content: '<li>Item</li>'
	});
};
