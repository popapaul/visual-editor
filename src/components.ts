import type { SvelteComponent } from "svelte";
import type { IDoc } from "./Renderer/src/parser/types";
import type { ProcessNode } from "./Renderer/src/parse";

type Name = `${string}-${string}`;

type Loader = (event: { event?: any, fetch?: typeof window.fetch, culture: string, attributes: Record<string, string> }) => Promise<Record<string, any>>

type Component = {
    name: `${string}-${string}`;
    props: [];
    component: () => Promise<SvelteComponent>,
}

export const components = new Map<string, () => Promise<any>>();
export const loaders = new Map<string, Loader>();
