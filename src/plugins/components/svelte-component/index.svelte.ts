import type { Editor } from 'grapesjs';
import { components } from '../../../components';
import { mount } from 'svelte';
import { createRawSnippet } from 'svelte';
// import { detach, insert } from 'svelte/internal';

// function createSlots(slots) {
//     const svelteSlots = {};

//     for (const slotName in slots) {
//         svelteSlots[slotName] = [createSlotFn(slots[slotName])];
//     }

//     function createSlotFn(element) {
//         return function () {
//             return {
//                 c: () => { },

//                 m: function mount(target, anchor) {
//                     insert(target, element, anchor);
//                 },

//                 d: function destroy(detaching) {
//                     if (detaching) {
//                         detach(element);
//                     }
//                 },

//                 l: () => { },
//             };
//         }
//     }
//     return svelteSlots;
// }

const getSnippet = (element: Element) => createRawSnippet(() => {
    return {
        render: () => `<div style="display:contents;"></div>`,
        setup: (node) => {

            $effect(() => {
                node.replaceWith(element);
            });
        }
    };
});

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
                        props.children = getSnippet(children.map(x => x.view.el)[0]);
                        props.$$scope = {}
                    }

                    if (component.loader) {
                        const data = await component.loader({ fetch, culture: "ro", attributes: props });
                        props = { ...props, ...data }
                    }
                    mount(Component, {
                        target: el,
                        props
                    });
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

