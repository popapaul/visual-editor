export function formatHtml(input: string) {
	// 1. Remove line breaks / Mso classes
	var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
	var output = input.replace(stringStripper, ' ');

	// 2. Strip Word generated HTML comments
	var commentSripper = new RegExp('<!--(.*?)-->', 'g');
	var output = output.replace(commentSripper, '');
	var tagStripper = new RegExp('<(/)*(\\?xml:|st1:|o:)(.*?)>', 'gi');

	// 3. Remove tags leave content if any
	output = output.replace(tagStripper, '');

	return output;
}
