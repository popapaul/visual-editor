import type { Editor } from 'grapesjs';
import * as components from './components';
import dragMode from './dragMode';
import jodit from './jodit';

export default [...Object.values(components), dragMode, jodit] as ((
	editor: Editor,
	config: any
) => void)[];
