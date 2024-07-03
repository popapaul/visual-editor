
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
				droppable: false,
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
			getInnerHTML(opts) {
			
				return innerHTML(this);
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


const innerHTML = (component: Component) => {
	const { src = '', poster = '', provider } = component.attributes.attributes;

	const placeholder = `<svg viewBox="0 0 24 24" style="width:100%; color:white;height:100%;padding:10%;background:rgba(140,140,140,1)"> 
        <path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"></path>
      </svg>`;

	if (!src && !poster)
		return placeholder;

	switch (provider) {
		case 'yt':
			const videoId = getYouTubeVideoID(src);

			return !videoId ? placeholder : `<iframe src="https://www.youtube.com/embed/${getYouTubeVideoID(src)}" style="width:100%;height:100%;background-image:url('${poster}');background-repeat:no-repeat; background-size:cover;"></iframe>`
		default:
			return `<video src="${src}" style="width:100%;height:100%;background-image:url('${poster}');background-repeat:no-repeat; background-size:cover;"/>`
	}
}

const renderVideo = (component: Component) => {
	component.view.el.innerHTML = innerHTML(component);
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
