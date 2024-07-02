import form from './form';
import input from './input';
import textarea from './textarea';
import type { Editor } from 'grapesjs';
const inputClass = `w-full p-2 rounded border-neutral-300 border`;

const getInput = (name: string, label: string, type = 'text') => `
	<div class="">
		<label for="${name}" class="font-semibold">${label}</label>
		<div class="relative mt-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 absolute top-3 left-2">
				<path id="i46js" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
				<circle id="iqfyy" cx="12" cy="7" r="4"></circle>
			</svg>
			<input id="${name}" name="${name}" type="${type}" placeholder="${name}" class="${inputClass} pl-8"/>
		</div>
	</div>
`;

const getTextarea = (name: string, label: string, klass = '') => `
	<div class="${klass}">
		<label for="${name}" class="font-semibold">${label}</label>
		<div class="relative mt-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 absolute top-3 left-2">
				<path id="i46js" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
				<circle id="iqfyy" cx="12" cy="7" r="4"></circle>
			</svg>
			<textarea id="${name}" name="${name}" placeholder="${name}" class="${inputClass} pl-8"></textarea>
		</div>
	</div>
`;

export const formInputs = (editor: Editor, opt = {}) => {
	form(editor);
	input(editor);
	textarea(editor);

	editor.BlockManager.add('form', {
		label: 'Formular Contact',
		content: `<enhanced-form method="post" action="?/contact" class="block p-2">
					<h3 class="mb-6 text-2xl leading-normal font-medium">Formular de contact</h3>
					<div class="grid grid-cols-2 gap-6">

					${getInput('name', 'Nume')}

					${getInput('email', 'Email', 'email')}

					${getInput('phone', 'Telefon')}

					${getInput('city', 'Localitate')}

					${getTextarea('message', 'Mesaj', 'col-span-2')}

					</div>
					<button type="submit" name="send" class="hover:bg-indigo-700 mt-4 border-indigo-600 hover:border-indigo-700 text-white rounded-md justify-center items-center px-4 py-1 bg-primary transition-all">Trimite mesaj</button>
				</enhanced-form>	
				`,
		category: 'Formular',
		media: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
					<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
					<g><g><g><path d="M346.7,903.3H207V96.6h319.4v309.3c25.6-6.6,52.3-10.5,79.9-10.5c2.3,0,4.5,0.3,6.7,0.3V10H120.4v979.9h320.4C403.9,967.6,372,938.1,346.7,903.3z"/><path d="M613,456.8c-147,0-266.6,119.6-266.6,266.6C346.4,870.4,466,990,613,990c147,0,266.6-119.6,266.6-266.6C879.6,576.4,760.1,456.8,613,456.8z M613,917.6c-107.1,0-194.3-87-194.3-194.3c0-107.1,87.1-194.2,194.3-194.2c107.1,0,194.2,87.1,194.2,194.2C807.2,830.6,720.2,917.6,613,917.6z"/><polygon points="646.7,607.8 577,607.8 577,689.1 497.5,689.1 497.5,758.8 577,758.8 577,838.9 646.7,838.9 646.7,758.8 728.6,758.8 728.6,689.1 646.7,689.1 "/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>
				</svg>`
	});

	editor.BlockManager.add('input-text', {
		label: 'Input Text',
		content: getInput('input', 'Placeholder'),
		category: 'Formular',
		media: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
					<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
					<g><g><g><path d="M346.7,903.3H207V96.6h319.4v309.3c25.6-6.6,52.3-10.5,79.9-10.5c2.3,0,4.5,0.3,6.7,0.3V10H120.4v979.9h320.4C403.9,967.6,372,938.1,346.7,903.3z"/><path d="M613,456.8c-147,0-266.6,119.6-266.6,266.6C346.4,870.4,466,990,613,990c147,0,266.6-119.6,266.6-266.6C879.6,576.4,760.1,456.8,613,456.8z M613,917.6c-107.1,0-194.3-87-194.3-194.3c0-107.1,87.1-194.2,194.3-194.2c107.1,0,194.2,87.1,194.2,194.2C807.2,830.6,720.2,917.6,613,917.6z"/><polygon points="646.7,607.8 577,607.8 577,689.1 497.5,689.1 497.5,758.8 577,758.8 577,838.9 646.7,838.9 646.7,758.8 728.6,758.8 728.6,689.1 646.7,689.1 "/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>
				</svg>`
	});

	editor.BlockManager.add('textarea', {
		label: 'Textarea',
		content: getTextarea('textarea', 'Placeholder'),
		category: 'Formular',
		media: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
					<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
					<g><g><g><path d="M346.7,903.3H207V96.6h319.4v309.3c25.6-6.6,52.3-10.5,79.9-10.5c2.3,0,4.5,0.3,6.7,0.3V10H120.4v979.9h320.4C403.9,967.6,372,938.1,346.7,903.3z"/><path d="M613,456.8c-147,0-266.6,119.6-266.6,266.6C346.4,870.4,466,990,613,990c147,0,266.6-119.6,266.6-266.6C879.6,576.4,760.1,456.8,613,456.8z M613,917.6c-107.1,0-194.3-87-194.3-194.3c0-107.1,87.1-194.2,194.3-194.2c107.1,0,194.2,87.1,194.2,194.2C807.2,830.6,720.2,917.6,613,917.6z"/><polygon points="646.7,607.8 577,607.8 577,689.1 497.5,689.1 497.5,758.8 577,758.8 577,838.9 646.7,838.9 646.7,758.8 728.6,758.8 728.6,689.1 646.7,689.1 "/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>
				</svg>`
	});
};
