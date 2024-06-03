import type { Editor } from 'grapesjs';
import * as components from './components';
import dragMode from './dragMode';
//import customElements from './custom-elements';
export default [...Object.values(components), dragMode] as ((
	editor: Editor,
	config: any
) => void)[];
