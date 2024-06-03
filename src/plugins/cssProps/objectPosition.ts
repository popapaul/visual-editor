const Dummy = (editor) => {
	editor.StyleManager.addType('object-position', {
		create({ props, change }) {
			const el = document.createElement('div');
			el.innerHTML = `
         <div class="horizontal-align">
           <span class="icon-left-open "></span>
           <span class="icon-right-open "></span>
           <input type="range"  min="0" max="100"/>
         </div>
         <div class="vertical-align">
         <div>
           <span class="icon-left-open"></span>
           <span class="icon-right-open "></span>
           </div>
           <input type="range"  min="0" max="100"/>
         </div>`;
			function getValues(complete) {
				const horizontal = (el.querySelector('.horizontal-align input') as HTMLInputElement).value;
				const vertical = (el.querySelector('.vertical-align input') as HTMLInputElement).value;
				change({ horizontal, vertical, complete });
			}
			const horizontalEl = el.querySelector('.horizontal-align  input');
			horizontalEl.addEventListener('change', (event) => getValues(true));
			horizontalEl.addEventListener('input', (event) => getValues(false));

			const verticalEl = el.querySelector('.vertical-align  input');
			verticalEl.addEventListener('change', (event) => getValues(true));
			verticalEl.addEventListener('input', (event) => getValues(false));
			return el;
		},
		emit({ props, updateStyle }, { horizontal, vertical, complete }) {
			// Pass a string value for the exact CSS property or an object containing multiple properties
			// eg. updateStyle({ [props.property]: valueRes, color: 'red' });
			updateStyle({ 'object-position': `${horizontal}% ${vertical}%` }, { complete });
		},
		update({ value, el }) {
			const verticalValue = value.split('%')[0];
			const horinzontalValue = value.split('%')[1];

			el.querySelector('.horizontal-align input').value = parseInt(verticalValue?.trim(), 10);
			el.querySelector('.vertical-align input').value = parseInt(horinzontalValue?.trim(), 10);
		},
		destroy() {
			// In order to prevent memory leaks, use this method to clean, eventually, created instances, global event listeners, etc.
		}
	});
};
export default Dummy;
