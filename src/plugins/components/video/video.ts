import type { Component, Editor } from 'grapesjs';

export default (editor: Editor) => {
	editor.DomComponents.removeType('video');
	editor.DomComponents.removeType('iframe');
	editor.DomComponents.addType('video', {
		isComponent: (el) => el.tagName === 'MEDIA',
		model: {
			defaults: {
				tagName: 'media',
				style: { display: 'block' },
				attributes: { provider: 'yt' },
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
								name: 'HTML5 Source',
								value: 'so'
							},
							{
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
			component.components(
				`<iframe src="${src}" style="width:100%;height:100%;background-image:url(${poster});background-repeat:no-repeat; background-size:cover;"></iframe>`
			);

			break;

		default:
			component.components(
				`<video src="${src}" poster="${poster}" style="width:100%;height:100%;"/>`
			);
			getVideoThumbnail(component);
			break;
	}

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
