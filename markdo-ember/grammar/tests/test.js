import { parser } from "../dist/index.js";

let example = `
# Section 1

[ ] Test

# Section 2
`;

let result = parser.parse(example);

console.log(result);