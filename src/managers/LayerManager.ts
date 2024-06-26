import type { LayerManagerConfig } from 'grapesjs';

const layerManager: LayerManagerConfig = {
	stylePrefix: '',

	// Specify the element to use as a container, string (query) or HTMLElement
	// With the empty value, nothing will be rendered
	appendTo: 'grapes-layers',

	// Enable/Disable globally the possibility to sort layers
	sortable: true,

	// Enable/Disable globally the possibility to hide layers
	hidable: true,

	// Hide textnodes
	hideTextnode: true,

	// Indicate a query string of the element to be selected as the root of layers.
	// By default the root is the wrapper
	root: '',

	// Indicates if the wrapper is visible in layers
	showWrapper: true,

	// Show hovered components in canvas
	showHover: true,

	// Scroll to selected component in Canvas when it's selected in Layers
	// true, false or `scrollIntoView`-like options,
	// `block: 'nearest'` avoids the issue of window scolling
	scrollCanvas: { behavior: 'smooth', block: 'nearest' },

	// Scroll to selected component in Layers when it's selected in Canvas
	// true, false or `scrollIntoView`-like options
	scrollLayers: { behavior: 'auto', block: 'nearest' },

	// Highlight when a layer component is hovered
	highlightHover: true,

	/**
	 * WARNING: Experimental option
	 * A callback triggered once the component layer is initialized.
	 * Useful to trigger updates on some component prop change.
	 * @example
	 * onInit({ component, render, listenTo }) {
	 *  listenTo(component, 'change:some-prop', render);
	 * };
	 */
	onInit: () => {},

	/**
	 * WARNING: Experimental option
	 * A callback triggered once the component layer is rendered.
	 * A callback useful to update the layer DOM on some component change
	 * @example
	 * onRender({ component, el }) { // el is the DOM of the layer
	 *  if (component.get('some-prop')) {
	 *    // do changes using the `el` DOM
	 *  }
	 * }
	 */
	onRender: () => {},

	/**
	 * Extend Layer view object (view/ItemView.js)
	 * @example
	 * extend: {
	 *   setName(name) {
	 *     // this.model is the component of the layer
	 *     this.model.set('another-prop-for-name', name);
	 *   },
	 * },
	 */
	extend: {}
};
export default layerManager;
