import blocksBasic from 'grapesjs-blocks-basic';
import parserPostCSS from 'grapesjs-parser-postcss';
import styleManager from './managers/StyleManager';
import blockManager from './managers/BlockManager';
import panelManager from './managers/PanelManager';
import layerManager from './managers/LayerManager';
import selectorManager from './managers/SelectorManager';
import deviceManager from './managers/DeviceManager';
import tailwind from './plugins/tailwind';

import ObjectPosition from './plugins/cssProps/objectPosition';
import components from './plugins';

import type { EditorConfig } from 'grapesjs';


const config: EditorConfig = {
	protectedCss: "",
	height: '100%',
	showOffsets: true,
	forceClass: false,
	showOffsetsSelected: true,
	canvasCss: ` 
	.gjs-selected{
		outline-offset:-1px !important;
	}
    .gjs-dashed *[data-gjs-highlightable] {
      outline: 1px dashed rgba(170,170,170,0.7);
    }
	body{
		padding-bottom:60px;
	}
	p:empty:before {
		content: ' ';
		white-space: pre;
	  }
    [data-gjs-type=wrapper] {
      overflow: unset;
    }
	.media{
		display:block;
	}
    .empty-img{
      background: #f5f5f5;
      border: none;
      min-height: 100px;
      min-width: 100px;
      display: block;
      outline: 3px solid #ffca6f;
      cursor: pointer;
      outline-offset: -2px;
    }
    `,
	noticeOnUnload: false,
	storageManager: false,
	avoidInlineStyle: true,
	showDevices: false,
	plugins: [
		//blocksBasic,
		...Object.values(components),
		ObjectPosition,
		parserPostCSS,
		tailwind
	],
	pluginsOpts: {
		blocksBasic: {
			blocks: ['image', 'map'],
			flexGrid: true
		}
	},
	canvas: {
		scripts: ['https://cdn.tailwindcss.com/']
	},
	deviceManager,
	traitManager: {
		custom: true
	},
	styleManager,
	blockManager,
	layerManager,
	domComponents: {},
	//richTextEditor:false,
	selectorManager,
	panels: panelManager,
	jsInHtml: true,
	optsHtml: {
		cleanId: true
	},
	clearStyles: false
};

export default config;
