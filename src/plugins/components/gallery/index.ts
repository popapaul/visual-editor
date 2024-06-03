import galery from './gallery';
import type { Editor } from 'grapesjs';
export default (editor: Editor) => {
	galery(editor);
	editor.BlockManager.add('gallery', {
		label: 'Gallery',
		content: `<lightbox-gallery class="grid gap-2 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
	        
	                    <img src="placeholder.svg" />
	           
	                    <img src="placeholder.svg" />
	            
	                    <img src="placeholder.svg" />
	            
	                    <img src="placeholder.svg" />
	          
	              </lightbox-gallery>`,
		category: 'Basic',
		media: `<svg style="margin:auto" width="40" height="40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
					<path fill="currentColor" d="M21 17H7V3h14m0-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2M3 5H1v16a2 2 0 0 0 2 2h16v-2H3m12.96-10.71l-2.75 3.54l-1.96-2.36L8.5 15h11l-3.54-4.71Z"></path>
				</svg>`
	});
};
