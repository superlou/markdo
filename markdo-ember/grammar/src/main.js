import {basicSetup} from "codemirror";
import {EditorState} from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {indentUnit, syntaxHighlighting} from "@codemirror/language";
import {defaultKeymap, indentWithTab} from "@codemirror/commands";
import {parser as markdoParser} from "../dist/markdo.grammar.js";
import {visualize} from "@colin_t/lezer-tree-visualizer";
import {markdo} from "./markdo.js";

let example = `Word

Section
    Subsection
        # Comment
        Content
        More # Comment 2
        [ ] Task1
        [ ] Task2
            [ ] Subtask2_1

  Etc
`;

let startState = EditorState.create({
  doc: example,
  extensions: [
    basicSetup,
    keymap.of([defaultKeymap, indentWithTab]),
    indentUnit.of("    "),
    syntaxHighlighting(),
    markdo(),
  ]
});

let view = new EditorView({
  state: startState,
  parent: document.body
});

let tree = markdoParser.parse(example);
let cursor = tree.cursor();
visualize(tree.cursor(), example);
