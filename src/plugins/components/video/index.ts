import type { Editor } from 'grapesjs';
import video from './video';
import youtube from './youtube';

export default function (editor: Editor) {
	video(editor);


	editor.BlockManager.add('video', {
		label: 'Video',
		category: 'Basic',
		media: '',

		content: {
			attributes: { class: 'block', provider: "yt" },
			components: `<media class="block aspect-video" provider="yt"  />`,
		}
	});
}
