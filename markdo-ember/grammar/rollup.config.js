import {lezer} from "@lezer/generator/rollup";
import {nodeResolve} from "@rollup/plugin-node-resolve";

export default [
  {
    input: "./src/markdo.grammar",
    output: [{
      file: "./dist/markdo.grammar.js",
      format: "es",
    }],
    plugins: [nodeResolve(), lezer()],
  }, {
    input: "./src/main.js",
    output: [{
      file: "./public/app.js",
      format: "iife",
    }],
    plugins: [nodeResolve()],
  }
]
