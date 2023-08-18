import {basicSetup} from "codemirror";
import {EditorState} from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {indentUnit, syntaxHighlighting} from "@codemirror/language";
import {defaultKeymap, indentWithTab} from "@codemirror/commands";
import {parser as markdoParser} from "../dist/markdo.grammar.js";
import {visualize} from "@colin_t/lezer-tree-visualizer";
import {markdo} from "./markdo.js";

let example = `Initial description.

# Features
[x] Use "#" for headings instead of "=".
    8/18/23 It was because of the external tokenizer.
[ ] Recognize updates.
    8/18/23 It seems to be chosing paragraph instead of Update.

## Heading 1.1
Content

[ ] Task 1
[x] Task 2
    Descriptive text for Task 2.
    [ ] Subtask 2.1 has additional text
        And it contains notes!
        Notes can go across two lines.
        For some reason they include the leading tabs... after the first line.
    This descriptive text is for Task 2.
`;

let startState = EditorState.create({
  doc: example,
  extensions: [
    basicSetup,
    keymap.of([defaultKeymap, indentWithTab]),
    indentUnit.of("    "),
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
