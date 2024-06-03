export default (editor) => {
	editor.Commands.extend('core:component-drag', {
		setPosition({ x, y, end, position, width, height }: any) {
			const { target, isTran, em } = this;
			const __p = !end; // Indicate if partial change

			let styleUp = {};

			if (isTran) {
				const unit = 'px';
				const left = `${parseInt(x, 10)}${unit}`;
				const top = `${parseInt(y, 10)}${unit}`;
				let transform = target.getStyle()['transform'] || '';
				transform = this.setTranslate(transform, 'x', left);
				transform = this.setTranslate(transform, 'y', top);
				styleUp = { transform, __p };
				target.addStyle(styleUp, { avoidStore: !end });
			} else {
				const parent = target.view.el.offsetParent as HTMLElement;
				const isParentStatic = getComputedStyle(parent).position == 'static';

				const parentHeight = isParentStatic ? window.innerHeight : parent.clientHeight;

				const unit = '%';
				const left = `${Number((x * 100) / parent.clientWidth)}${unit}`;
				const top = `${Number((y * 100) / parentHeight)}${unit}`;
				const adds: any = { position, width, height };
				const style: any = { left, top, __p };
				Object.keys(adds).forEach((add) => {
					const prop = adds[add];
					if (prop) style[add] = prop;
				});
				styleUp = style;
				target.addStyle(styleUp, { avoidStore: !end });
			}
		},
		getPosition() {
			const { target, isTran } = this;
			const { transform } = target.getStyle();
			if (isTran) {
				return {
					x: this.getTranslate(transform),
					y: this.getTranslate(transform, 'y')
				};
			}

			const element = target.view.el as HTMLElement;

			const x = element.offsetLeft;
			const y = element.offsetTop;

			return { x, y };
		},

		onStart(event: Event) {
			const { target, editor, isTran, opts } = this;
			const { center, onStart } = opts;
			const { Canvas } = editor;
			const style = target.getStyle();
			const position = 'absolute';
			onStart && onStart(this._getDragData());
			if (isTran) return;

			if (style.position !== position) {
				let {
					offsetLeft,
					offsetTop,
					clientWidth: width,
					clientHeight: height
				} = target.getEl() as HTMLElement;
				const parent = target.view.el.offsetParent as HTMLElement;
				const isParentStatic = getComputedStyle(parent).position == 'static';

				const { x, y } = Canvas.getMouseRelativeCanvas(event);

				if (center) {
					offsetLeft = x;
					offsetTop = y;
				} else if (isParentStatic) {
					offsetTop = y;
				}

				this.setPosition({
					x: offsetLeft,
					y: offsetTop,
					width: `${width}px`,
					height: `${height}px`,
					position
				});
			}
		}
	});
};
