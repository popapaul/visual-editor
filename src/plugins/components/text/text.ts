import type { Component, Editor } from "grapesjs";
function CleanWordHTML(str: string) {

	const parser = new DOMParser();

	const doc = parser.parseFromString(str, "text/html");
	const body = doc.querySelector("body");

	body.querySelectorAll("*").forEach((element: HTMLElement) => {
		element.className = "";
		element.removeAttribute("lang");
		const style = element.style;
		if (style.textAlign)
			element.classList.add(`text-${style.textAlign}`);
		if (style.marginLeft)
			element.classList.add(`ml-[${style.marginLeft}]`);
		if (style.background)
			element.classList.add(`bg-[${style.background.replaceAll(" ", "")}]`);
		if (style.backgroundColor)
			element.classList.add(`bg-[${style.backgroundColor.replaceAll(" ", "")}]`);
		if (style.color)
			element.classList.add(`text-[${style.color.replaceAll(" ", "")}]`);
		if (style.textIndent && style.textIndent != "0px")
			element.classList.add(`indent-[${style.textIndent.replace("-", "")}]`)
		//element.style = null;
		if (element.tagName == "OL")
			element.classList.add("list-decimal", "pl-4")
		if (element.tagName == "UL")
			element.classList.add("list-disc", "pl-4")


		if ((element.tagName == "SPAN" || element.tagName == "O:P") && !element.childNodes.length)
			element.remove()

		if (element.tagName == "SPAN" && (!element.className || !element.classList.length))
			element.replaceWith(element.innerText)
		if (element.tagName == "U" && element.innerText == '\xa0')
			element.replaceWith(doc.createElement("br"))


	})


	const result = body.innerHTML.replaceAll('ü', '✓').replaceAll("·", "•").replaceAll("Ø", "➣");

	return result;
}
function saveCursorPosition(window: Window) {
	let selection = window.getSelection();
	if (selection.rangeCount > 0) {
		return selection.getRangeAt(0);
	}
	return null;
}

function restoreCursorPosition(window: Window, savedRange) {
	if (savedRange) {
		let selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(savedRange);
	}
}

export const text = (editor: Editor) => {

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
					blur: 'onBlur',
					paste: 'onPaste',
					//mouseleave: 'onLeave'
				};
			},
			async onBlur() {
				const { model, em }: { model: Component, em: any } = this;
				//console.log(this)
				//const window = editor.Canvas.getWindow()
				//const range = saveCursorPosition(window);

				//	model.trigger('sync:content', { noCount: true });
				await this.syncContent();
				//this.model.components(content);
				//	console.log(content)
				//this.em.set({ content })
				//const comps = model.components(content);
				//this.content = content;

				//model.set('content', content);
				//console.log(range)
				//restoreCursorPosition(window, range)



			},

			onPaste: (e: ClipboardEvent) => {
				const target = e.target as HTMLElement;
				e.preventDefault();
				e.stopPropagation();

				const text = CleanWordHTML(e.clipboardData.getData('text/html'));
				//const component = editor.getWrapper().find(`#${target.id}`)?.[0];
				// if (component)
				// 	component.replaceWith(text)
				target.ownerDocument.execCommand('insertHTML', false, text);
			}
		},
	});
};
