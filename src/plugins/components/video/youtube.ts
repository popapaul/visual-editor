import type { Component, Editor } from 'grapesjs';
export default (editor: Editor) => {
	editor.DomComponents.addType('youtube', {
		isComponent: (el) => el.tagName === 'MEDIA-YOUTUBE',
		model: {
			defaults: {
				tagName: 'media-youtube',
				resizable: true,
				persistable: true,
				traits: [
					{
						type: 'text',
						label: 'Title',
						name: 'alt'
					},
					{
						type: 'text',
						label: 'Youtube url/id',
						name: 'src'
					},
					{
						type: 'checkbox',
						label: 'Poster youtube',
						name: 'poster'
					}
				]
			},
			init() {
				this.listenTo(this, 'change:attributes:src change:attributes:poster', renderVideo);
			}
		},

		view: {
			onRender({ model }) {
				setTimeout(() => renderVideo(model), 100);
			}
		}
	});
};

function YouTubeGetID(url) {
	url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}

const renderVideo = (component: Component) => {
	const { src = '', poster } = component.attributes.attributes;
	if (!poster) return;

	let img = component.findType('image')[0];
	if (!img) {
		component.components(`<img src="${src}" style="width:100%;height:100%;object-fit:cover;"/>`);
		img = component.findType('image')[0];
	}
	img.addAttributes({ src: `https://i.ytimg.com/vi/${YouTubeGetID(src)}/maxresdefault.jpg` });
};
