import type { Editor } from 'grapesjs';
import { components, loaders } from '../../../components';
import type { ComponentType } from 'svelte';


type CustomComponent = {
    name: string;
    component: Promise<any>,
    load: Promise<Record<string, any>>
}

const registerComponent = (editor: Editor, { name, component, load }: CustomComponent) => {

    Array.from(components.entries()).map(([name, loader]) => {

        editor.Components.addType(name, {
            isComponent: (el) => el.tagName === name.toUpperCase(),
            model: {
                defaults: {

                }
            },
            view: {
                async onRender({ editor, el, model }) {
                    const Component: ComponentType = await loader();
                    let props = model.attributes.attributes;

                    if (loaders.has(name)) {
                        const data = await loaders.get(name)({ fetch, attributes: props });

                        props = { ...props, ...data }
                    }
                    new Component({
                        target: el,
                        props,
                        // anchor?: Element;

                        // context?: Map<any, any>;
                        // hydrate?: boolean;
                        //intro?: boolean;
                        //$$inline?: boolean;
                    })
                },
            }
        });
    })


};



export default registerComponent;
