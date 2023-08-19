import {LanguageSupport, LRLanguage} from "@codemirror/language";
import {styleTags, tags as t, Tag} from "@lezer/highlight";
import {parser} from "../dist/markdo.grammar.js";

let headingTag = Tag.define();

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      "Heading!": t.heading,
      "DoneTask/... RejectedTask/...": t.strikethrough,
    })
  ]
});

export const markdoLanguage = LRLanguage.define({
  parser: parserWithMetadata,
});

export function markdo() {
  return new LanguageSupport(markdoLanguage, []);
}