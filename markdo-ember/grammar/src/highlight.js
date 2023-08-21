import {tags} from "@lezer/highlight";
import {HighlightStyle} from "@codemirror/language";

const HEADING_FONT = "sans";

export const markdoHighlight = HighlightStyle.define([
  {tag: tags.heading1, fontWeight: "bold", fontSize: "30pt", textDecoration: "underline", fontFamily: HEADING_FONT},
  {tag: tags.heading2, fontWeight: "bold", fontSize: "22pt", fontFamily: HEADING_FONT},
  {tag: tags.heading3, fontWeight: "bold", fontSize: "18pt", fontFamily: HEADING_FONT},
  {tag: tags.heading4, fontWeight: "bold", fontSize: "14pt", fontFamily: HEADING_FONT},
  {tag: tags.heading5, fontWeight: "bold", fontSize: "12pt", fontFamily: HEADING_FONT},
  {tag: tags.heading6, fontWeight: "bold", fontSize: "10pt", fontFamily: HEADING_FONT},
  {tag: tags.strikethrough, textDecoration: "line-through", color: "#AAA"},
]);