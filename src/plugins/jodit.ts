import type { Editor } from "grapesjs";
import { Jodit } from "jodit";

import 'jodit/es2021/jodit.fat.min.css';
import css from 'jodit/es2021/jodit.fat.min.css?raw';
import type { Config } from "jodit/types/config";
// IMPORTANT: place the code in a new plugin

export default (editor: Editor) => {
    const focus = (el, rte) => {
        if (rte?.isFocused)
            return;

        el.contentEditable = true;

        // rte?.focus();
        // if (rte)
        //  rte.value = el.innerHTML
    }
    editor.onReady(() => {
        const document = editor.Canvas.getDocument();
        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    })
    editor.on('rteToolbarPosUpdate', (pos) => {
        console.log(pos)
    });

    let value = "";

    editor.setCustomRte<Jodit>({

        enable(el, rte) {
            // If already exists just focus

            console.log("enable", el, rte)
            // if (rte) {
            //     focus(el, rte);
            //     return rte;
            // }

            // CKEditor initialization
            rte = Jodit.make(el, {
                theme: "light",
                inline: true, // Enable inline mode
                toolbarInline: true, // Show toolbar as popup
                //toolbarInlineForSelection: true, // Show toolbar only when text is selected

                preset: "inline",
                toolbarInlineDisableFor: [],
                toolbarInlineDisabledButtons: ['source'],
                popup: {
                    a: Jodit.atom(['link', 'unlink'])
                },
                toolbar: document.querySelector('.gjs-rte-toolbar') as any,


                hotkeys: {
                    redo: 'ctrl+z',
                    undo: 'ctrl+y,ctrl+shift+z',
                    indent: 'ctrl+]',
                    outdent: 'ctrl+[',
                    bold: 'ctrl+b',
                    italic: 'ctrl+i',
                    removeFormat: 'ctrl+shift+m',
                    insertOrderedList: 'ctrl+shift+7',
                    insertUnorderedList: 'ctrl+shift+8',
                    openSearchDialog: 'ctrl+f',
                    openReplaceDialog: 'ctrl+r'
                },
                askBeforePasteHTML: true,
                processPasteHTML: true,
                processPasteFromWord: true,
                addNewLine: false,
                enter: 'div',

                ownerDocument: editor.Canvas.getDocument(),
                ownerWindow: editor.Canvas.getWindow(),
                buttons: [
                    'bold', 'italic', 'underline', '|',
                    'ul', 'ol', '|',
                    'link', 'image', '|',
                    'align', 'undo', 'redo'
                ],
                showXPathInStatusbar: false // Optional: hide the path of the selected element in the status bar

            } as Partial<Config>);




            focus(el, rte);
            return rte;
        },
        disable(el, rte) {
            console.log("disable", el, rte)
            el.contentEditable = "false";

            value = rte.value;
            rte.destruct();
        },
        getContent(el, rte) {
            return value;
        },
        //parseContent: true,
    });
}
