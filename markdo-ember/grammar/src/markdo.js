import {LanguageSupport, LRLanguage} from "@codemirror/language";
import {styleTags, tags as t, Tag} from "@lezer/highlight";
import {parser} from "../dist/markdo.grammar.js";

let headingTag = Tag.define();

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      "Heading1!": t.heading1,
      "Heading2!": t.heading2,
      "Heading3!": t.heading3,
      "Heading4!": t.heading4,
      "Heading5!": t.heading5,
      "Heading6!": t.heading6,
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