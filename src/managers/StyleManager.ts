const GeneralSelector = {
	name: 'General',
	open: false,
	buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
};
const ImageSelector = {
	name: 'Image',
	open: false,
	buildProps: ['object-fit', 'object-position'],
	properties: [
		{
			id: 'object-position',
			name: 'object-position',
			property: 'object-position',
			type: 'object-position',
			toRequire: 1
		},
		{
			id: 'object-fit',
			name: 'Object-Fit',
			property: 'object-fit',
			type: 'select',
			defaults: 'initial',
			toRequire: 1,
			list: [
				{
					value: 'initial',
					name: 'Initial'
				},
				{
					value: 'contain',
					name: 'Contain'
				},
				{
					value: 'cover',
					name: 'Cover'
				},
				{
					value: 'fill',
					name: 'Fill'
				}
			]
			// require:1,
			// This will hide the property and will be shown only if some
			// selected component would have something like:
			// 'stylable-require': ['flex-basis']
		}
	]
};
const FlexSelector = {
	name: 'Flex',
	open: false,
	buildProps: [
		'flex-direction',
		'flex-wrap',
		'justify-content',
		'align-items',
		'align-content',
		'order',
		'flex-basis',
		'flex-grow',
		'flex-shrink',
		'align-self'
	]
};
const DimensionSelectors = {
	name: 'Dimension',
	open: false,
	buildProps: [
		'width',
		'height',
		'min-width',
		'min-height',
		'max-width',
		'max-height',
		'margin',
		'padding'
	]
};

const TypographySelectors = {
	name: 'Typography',
	open: false,
	buildProps: [
		'font-family',
		'font-size',
		'font-weight',
		'letter-spacing',
		'color',
		'line-height',
		'text-shadow',
		'text-align'
	]
};

const DecorationsSelectors = {
	name: 'Decorations',
	open: false,
	buildProps: [
		'border-radius-c',
		'border-style',
		'border-width',
		'border-color',
		'background-size',
		'background-color',
		'border-radius',
		'border',
		'box-shadow',
		'background'
	],
	properties: []
};

const ExtraSelectors = {
	name: 'Extra',
	open: false,
	buildProps: ['transition', 'perspective', 'transform']
};

const styleManager = {
	stylePrefix: 'sm-',

	sectors: [
		GeneralSelector,
		ImageSelector,
		FlexSelector,
		DimensionSelectors,
		TypographySelectors,
		DecorationsSelectors,
		ExtraSelectors
	],

	// Specify the element to use as a container, string (query) or HTMLElement
	// With the empty value, nothing will be rendered
	appendTo: 'grapes-styles',

	// Hide the property in case it's not stylable for the
	// selected component (each component has 'stylable' property)
	hideNotStylable: true,

	// Highlight changed properties of the selected component
	highlightChanged: true,

	// Highlight computed properties of the selected component
	highlightComputed: true,

	// Show computed properties of the selected component, if this value
	// is set to false, highlightComputed will not take effect
	showComputed: true,

	// Adds the possibility to clear property value from the target style
	clearProperties: true,

	// Properties not to take in account for computed styles
	avoidComputed: ['width', 'height']
};

export default styleManager;
