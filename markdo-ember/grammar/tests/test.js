import { parser } from "../dist/index.js";
import { logTree } from "../dist/print-lezer-tree.js"

let example = `
Word

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

let tree = parser.parse(example);

console.log(tree);

logTree(tree, example);