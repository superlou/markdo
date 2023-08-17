import {LanguageSupport, LRLanguage} from "@codemirror/language";
import {styleTags, tags as t} from "@lezer/highlight";
import {parser} from "../dist/markdo.grammar.js";

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      Task: t.variableName,
    })
  ]
});

export const markdoLanguage = LRLanguage.define({
  parser: parserWithMetadata,
});

export function markdo() {
  return new LanguageSupport(markdoLanguage, []);
}