import type { Editor } from 'grapesjs';
import tailwindConfig from '$root/tailwind.www.config';

import styleApp from "$root/src/routes/(www)/app.css?raw"

export default (editor) => {
	const options = {
		tailwindPlayCdn: 'https://cdn.tailwindcss.com',
		plugins: [],
		config: {
			corePlugins: {
				preflight: false
			},
			theme: tailwindConfig.theme
		}
	};

	const appendTailwindCss = (ed: Editor) => {
		const { config } = options;

		// checks iframe is ready before loading Tailwind CSS - issue with firefox

		const f = setInterval(() => {
			const iframe = ed.Canvas.getFrameEl();
			const window = iframe?.contentWindow as any;

			if (window?.tailwind) {
				ed.Canvas.getBody().classList.add('content');



				const style = document.createElement('style');
				style.setAttribute("type", "text/tailwindcss");
				style.innerHTML = styleApp.replace(/\@config.*;/g, "");
				window.document.head.appendChild(style);

				const script = document.createElement('script');
				script.innerHTML = `tailwind.config =  ${JSON.stringify(config)} `;
				window.document.head.appendChild(script);

				window.tailwind.config = config;

				clearInterval(f);
			}
		}, 100);
	};
	editor.Commands.add('tailwind', (editor) => appendTailwindCss(editor));
};
