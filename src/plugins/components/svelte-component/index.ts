import type { Editor } from 'grapesjs';
import { components } from '../../../components';
import { detach, insert, noop } from 'svelte/internal';

function createSlots(slots) {
    const svelteSlots = {};

    for (const slotName in slots) {
        svelteSlots[slotName] = [createSlotFn(slots[slotName])];
    }

    function createSlotFn(element) {
        return function () {
            return {
                c: noop,

                m: function mount(target, anchor) {
                    insert(target, element, anchor);
                },

                d: function destroy(detaching) {
                    if (detaching) {
                        detach(element);
                    }
                },

                l: noop,
            };
        }
    }
    return svelteSlots;
}

export const svelteComponents = (editor: Editor) => {
    Array.from(components.entries()).map(([tagName, component]) => {

        editor.Components.addType(tagName, {
            isComponent: (el) => el.tagName === tagName.toUpperCase(),
            model: {
                defaults: component.definition,
                init() {

                    this.listenTo(this.get('components'), 'add', () => setTimeout(() => this.trigger("rerender"), 110));
                    this.listenTo(
                        this,
                        'change:attributes',
                        () => this.trigger("rerender")
                    );
                },


            },
            view: {
                async onRender({ editor, el, model }) {

                    const Component = await component.component();
                    let props = { ...model.attributes.attributes };
                    const children = model.components();

                    if (children?.length) {
                        props.$$slots = createSlots({ default: children.map(x => x.view.el)[0] })
                        props.$$scope = {}
                        console.log(tagName, children.map(x => x.view.el))
                    }

                    if (component.loader) {
                        const data = await component.loader({ fetch, culture: "ro", attributes: props });

                        props = { ...props, ...data }

                    }
                    new Component({ target: el, props })
                },
            }
        });

        editor.BlockManager.add(tagName, {
            id: tagName,
            label: component.name,
            category: component.category,
            select: true,
            content: `<${tagName} class="block" />`
        })
    })
};

