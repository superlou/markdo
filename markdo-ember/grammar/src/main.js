import {basicSetup} from "codemirror";
import {EditorState} from "@codemirror/state";
import {EditorView, keymap, gutter} from "@codemirror/view";
import {indentUnit, syntaxHighlighting} from "@codemirror/language";
import {defaultKeymap, indentWithTab} from "@codemirror/commands";
import {parser as markdoParser} from "../dist/markdo.grammar.js";
import {visualize} from "@colin_t/lezer-tree-visualizer";
import {markdo} from "./markdo.js";
import {localStorageSaveOnChange, localStorageLoad} from "./storage.js";
import {markdoHighlight} from "./highlight.js";
import {completionPlugin} from "./completion.js";
import {dateAlertGutter} from "./date-alert.js";

let startState = EditorState.create({
  doc: localStorageLoad,
  extensions: [
    basicSetup,
    keymap.of([defaultKeymap, indentWithTab]),
    indentUnit.of("    "),
    markdo(),
    localStorageSaveOnChange,
    syntaxHighlighting(markdoHighlight),
    completionPlugin,
    dateAlertGutter,
  ],
});

let view = new EditorView({
  state: startState,
  parent: document.body
});

// let tree = markdoParser.parse(localStorageLoad);
// let cursor = tree.cursor();
// visualize(tree.cursor(), localStorageLoad);
