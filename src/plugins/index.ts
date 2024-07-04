import type { Editor } from 'grapesjs';
import * as components from './components';
import dragMode from './dragMode';

export default [...Object.values(components), dragMode] as ((
	editor: Editor,
	config: any
) => void)[];
