
import type { Component, Editor } from 'grapesjs';


export default (editor: Editor) => {
	editor.DomComponents.removeType('map');
	editor.DomComponents.addType('map', {
		isComponent: (el) => el.tagName === 'MAP',
		model: {
			defaults: {
				tagName: 'map',
				resizable: true,
				traits: [
					{
						type: 'select',
						label: 'Tip hartă',
						name: 'type',
						options: [
							{
								id: "roadmap",
								value: "roadmap",
								label: 'Rutieră'
							},
							{
								id: "satellite",
								value: "satellite",
								label: 'Satelit'
							}
						]
					},
					{
						label: 'Adresă',
						type: 'text',
						name: 'address'
					},
					{
						type: 'number',
						label: 'Zoom',
						name: 'zoom'
					},
				]
			},
			init() {
				this.listenTo(this, 'change:attributes:address change:attributes:zoom change:attributes:type', renderMap);
			}
		},

		view: {
			onRender({ model }) {
				console.log(model)
				setTimeout(() => renderMap(model), 100);
			},
		}
	});
};

const renderMap = (component: Component) => {
	console.log(component)
	const { type = 'roadmap', zoom = 10, address } = component.attributes.attributes;

	component.view!.el.innerHTML = `<iframe src="https://maps.google.com/maps?z=${zoom}&t=${type}&q=${address}&output=embed" style="width:100%;height:100%;"></iframe>`

	component.view!.el.firstElementChild?.classList.add('gjs-no-pointer');
};

