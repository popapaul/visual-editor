import type { Editor } from "grapesjs";

export default (editor: Editor) => {

	editor.DomComponents.addType('text', {
		// Model definition
		extend: 'text',
		extendView: 'text',
		isComponent: (el) => {
			if (el.nodeType === 3 || el.tagName == "P") return true;


		},
		view: {
			events() {
				return {
					dblclick: 'onActive',
					input: 'onInput',
					paste: 'onPaste',
				};
			},
			onPaste: (e: ClipboardEvent) => {
				const target = e.target as HTMLElement;
				e.preventDefault();
				e.stopPropagation();

				const text = e.clipboardData.getData('text/plain');

				target.ownerDocument.execCommand('insertText', false, text?.trim());
			}
		},
	});
};
