import { ContextTracker } from "@lezer/lr"
import { indent, dedent } from "./indent.grammar.terms"

class IndentLevel {
  constructor(parent, depth) {
    this.parent = parent
    this.depth = depth
    this.hash = (parent ? parent.hash + parent.hash << 8 : 0) + depth + (depth << 4)
  }
}

export const trackIndent = new ContextTracker({
  start: new IndentLevel(null, 0),
  shift(context, term, stack, input) {
    if (term == indent) return new IndentLevel(context, stack.pos - input.pos)
    if (term == dedent) return context.parent
    return context
  },
  hash: context => context.hash
})