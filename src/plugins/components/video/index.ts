import video from './video';
import youtube from './youtube';

export default function (editor) {
	video(editor);
	youtube(editor);

	editor.BlockManager.add('youtube', {
		label: 'Youtube',
		category: 'Basic',
		media: '',
		attributes: { class: 'gjs-fonts gjs-f-video' },
		content: `
		 <media-youtube class="p-2 block" style="height:200px;" poster="true">
		 	<img style="width:100%;height:100%;object-fit:cover;" />
		 </media-youtube>`
	});

	editor.BlockManager.add('video', {
		label: 'Video',
		category: 'Basic',
		media: '',
		attributes: { class: 'gjs-fonts gjs-f-video' },
		content: {
			type: 'video'
		}
	});
}
