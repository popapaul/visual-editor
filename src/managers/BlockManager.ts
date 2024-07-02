import { Paragraph } from "@paulpopa/icons/fa/solid";
import { Image, Title } from "@paulpopa/icons/md/outlined";

const blocks = [
	{
		id: "text",
		label: 'Text',
		media: Title,
		category: 'Basic',
		activate: true,
		content: `<p class="px-2"> </p>`,
	},
	{
		id: 'image',
		label: 'Image',
		media: Image,
		category: 'Basic',
		activate: true,
		select: true,
		content: '<img src="" />'
	},


	{
		id: "icon",
		label: 'Icon',
		category: 'Basic',
		media: `<svg style="margin:auto;" width="40" height="40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
					<path fill="currentColor" d="M5.5 2C3.56 2 2 3.56 2 5.5v13C2 20.44 3.56 22 5.5 22H16l6-6V5.5C22 3.56 20.44 2 18.5 2h-13m.25 2h12.5A1.75 1.75 0 0 1 20 5.75V15h-1.5c-1.94 0-3.5 1.56-3.5 3.5V20H5.75A1.75 1.75 0 0 1 4 18.25V5.75A1.75 1.75 0 0 1 5.75 4m8.69 2.77c-.16 0-.32.02-.47.06c-.94.26-1.47 1.22-1.23 2.17c.05.15.12.3.21.44l3.23-.88c0-.17-.02-.34-.06-.51c-.21-.75-.9-1.28-1.68-1.28M8.17 8.5c-.17 0-.32 0-.47.05c-.93.26-1.48 1.22-1.23 2.15c.03.16.12.3.21.46l3.23-.88c0-.17-.02-.34-.06-.5A1.72 1.72 0 0 0 8.17 8.5m8.55 2.76l-9.13 2.51a5.266 5.266 0 0 0 5.36 1.64a5.273 5.273 0 0 0 3.77-4.15Z">
					</path>
				</svg>`,
		content: `
		<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" >
			<path fill="currentColor" d="M4 2c-1.11 0-2 .89-2 2v10h2V4h10V2H4m4 4c-1.11 0-2 .89-2 2v10h2V8h10V6H8m4 4c-1.11 0-2 .89-2 2v8c0 1.11.89 2 2 2h8c1.11 0 2-.89 2-2v-8c0-1.11-.89-2-2-2h-8Z"></path>
		</svg>`
	},


	{
		id: "container",
		label: 'Container',
		category: 'Layout',
		content: '<div class="container"></div>',
	},
	{
		id: "spacer",
		label: 'Spacer',
		category: 'Layout',
		media: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M249.6 392.3l-104 112c-9.094 9.781-26.09 9.781-35.19 0l-103.1-112c-6.484-6.984-8.219-17.17-4.406-25.92S14.45 352 24 352H80V160H24C14.45 160 5.812 154.3 1.999 145.6C-1.813 136.8-.0781 126.7 6.406 119.7l104-112c9.094-9.781 26.09-9.781 35.19 0l104 112c6.484 6.984 8.219 17.17 4.406 25.92C250.2 154.3 241.5 160 232 160H176v192h56c9.547 0 18.19 5.656 22 14.41S256.1 385.3 249.6 392.3z"></path></svg>`,
		content: `<div class="spacer"></div>`
	},
];

const blockManager = {
	// Specify the element to use as a container, string (query) or HTMLElement
	// With the empty value, nothing will be rendered
	//appendTo: 'grapes-blocks',
	custom: true,

	// Append blocks to canvas on click.
	// With the `true` value, it will try to append the block to the selected component.
	// If there is no selected component, the block will be appened to the wrapper.
	// You can also pass a function to this option, use it as a catch-all for all block
	// clicks and implement a custom logic for each block.
	// appendOnClick: (block, editor) => {
	//   if (block.get('id') === 'some-id')
	//    editor.getSelected().append(block.get('content'))
	//   else
	//    editor.getWrapper().append(block.get('content'))
	// }
	//appendOnClick: false,

	blocks
};
export default blockManager;
