import type { ComponentType } from "svelte";
import type { ComponentDefinition } from "grapesjs";

type Loader = (event: { event?: any, fetch?: typeof window.fetch, culture: string, attributes: Record<string, string> }) => Promise<Record<string, any>>

type Component = {
    tag: `${string}-${string}`;
    name: string;
    category?: string;
    loader?: Loader,
    definition?: ComponentDefinition,
    component: () => Promise<ComponentType>,
}

export const components = new Map<string, Component>();

export const registerComponent = (comp: Component) => {
    components.set(comp.tag, comp);
};
