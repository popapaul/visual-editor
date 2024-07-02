
import type { Component, Editor } from 'grapesjs';

function getYouTubeVideoID(url) {
	const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

export default (editor: Editor) => {
	editor.DomComponents.removeType('video');
	//editor.DomComponents.removeType('iframe');
	editor.DomComponents.addType('video', {
		isComponent: (el) => el.tagName === 'MEDIA',
		model: {
			defaults: {
				tagName: 'media',
				resizable: true,
				traits: [
					{
						type: 'text',
						label: 'Title',
						name: 'alt'
					},
					{
						label: 'Poster',
						type: 'image',
						name: 'poster'
					},
					{
						type: 'text',
						label: 'Src',
						name: 'src'
					},
					{
						type: 'select',
						label: 'Provider',
						name: 'provider',
						options: [
							{
								id: "so",
								name: 'HTML5 Source',
								value: 'so'
							},
							{
								id: "yt",
								name: 'Youtube',
								value: 'yt'
							}
						]
					}
				]
			},
			init() {
				this.listenTo(
					this,
					'change:attributes:provider change:attributes:src change:attributes:poster',
					renderVideo
				);
			}
		},

		view: {
			events: () => ({ dblclick: 'onActive' }),
			onRender({ model }) {
				setTimeout(() => renderVideo(model), 100);
			},
			onActive() {
				const { provider } = this.model.attributes.attributes;
				if (provider == 'yt')
					editor.Commands.run('open-assets', { type: 'images', attribute: 'poster' });
				else editor.Commands.run('open-assets', { type: 'videos', attribute: 'src' });
			}
		}
	});
};

const renderVideo = (component: Component) => {
	const { src = '', poster = '', provider } = component.attributes.attributes;


	switch (provider) {
		case 'yt':
			component.view.el.innerHTML = `<iframe src="https://www.youtube.com/embed/${getYouTubeVideoID(src)}" style="width:100%;height:100%;background-image:url(${poster});background-repeat:no-repeat; background-size:cover;"></iframe>`
			break;

		default:
			component.view.el.innerHTML = `<video src="${src}" poster="${poster}" style="width:100%;height:100%;"/>`

			getVideoThumbnail(component);
			break;
	}
	if (!src && !poster)
		component.view.el.innerHTML = `<svg style="width:100%; height:100%;padding:10%;background:rgba(140,140,140,1)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="gjs-no-pointer"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 288c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V288zM300.9 397.9L256 368V304l44.9-29.9c2-1.3 4.4-2.1 6.8-2.1c6.8 0 12.3 5.5 12.3 12.3V387.7c0 6.8-5.5 12.3-12.3 12.3c-2.4 0-4.8-.7-6.8-2.1z"></path></svg>`;

	component.view.el.firstElementChild?.classList.add('gjs-no-pointer');
};

const getVideoThumbnail = (component: Component) => {
	const { poster, src } = component.attributes.attributes;
	if (!src && poster) return;
	var video = document.createElement('video');
	var canvas = document.createElement('canvas');
	video.src = src;
	video.addEventListener('loadedmetadata', () => {
		// Seek the video to 0.1%
		video.currentTime = video.duration * 0.01;
		video.width = 400;
		video.height = 300;
		canvas.width = 400;
		canvas.height = 300;

		video.addEventListener('seeked', () => {
			var context = canvas.getContext('2d');
			context.drawImage(video, 0, 0, 400, 300);
			var dataURL = canvas.toDataURL('image/jpeg', 0.5);
			component.addAttributes({ poster: dataURL });
		});
	});
};
