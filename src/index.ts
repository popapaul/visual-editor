export { default as VisualEditor } from "./Editor.svelte";
export { default as registerComponent } from "./plugins/components/svelte-component/register"
export { default as Renderer } from "./Renderer/src/Renderer.svelte";
export { loadComponents } from "./Renderer/src/load";
//export { parse, isTag, isText } from "./RenderContent/parse";
export { generateAST } from "./Renderer/src/ast"
export { parse, isTag, isText } from "./Renderer/src/parse"
export { default as stringify } from "./Renderer/src/parser/stringify"
export { components, loaders } from "./components" 
