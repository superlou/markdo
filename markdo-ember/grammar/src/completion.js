import {WidgetType, EditorView, Decoration} from "@codemirror/view";
import {ViewUpdate, ViewPlugin} from "@codemirror/view";
import {syntaxTree} from "@codemirror/language";

class CompletionWidget extends WidgetType {
  constructor(closed, all) {
    super();    
    this.closed = closed;
    this.all = all;
  }
  
  eq(other) {
    return (this.closed === other.closed) && (this.all === other.all);
  }
  
  toDOM() {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cm-completion";
    wrap.innerHTML = `(${this.closed}/${this.all})`;
    return wrap;
  }
  
  ignoreEvent() {
    return false;
  }
}

const TASK_NODE_NAMES = ["OpenTask", "DoneTask", "RejectedTask"];

function completionWidgets(view) {
  let widgets = [];
  
  for (let {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (nodeRef) => {
        if (!TASK_NODE_NAMES.includes(nodeRef.name)) { return; }
        let block = nodeRef.node.getChild("Block");
        if (block === null) { return; }
        
        let open = block.getChildren("OpenTask").length;
        let done = block.getChildren("DoneTask").length;
        let rejected = block.getChildren("RejectedTask").length;
        let all = open + done + rejected;
        
        if (all === 0) { return; }
        
        let deco = Decoration.widget({
          widget: new CompletionWidget(done + rejected, all),
        });
        widgets.push(deco.range(nodeRef.from + 3));
      }
    })
  }
  
  return Decoration.set(widgets);
}

export const completionPlugin = ViewPlugin.fromClass(class { 
  constructor(view) {
    this.decorations = completionWidgets(view);
  }
  
  update(update) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = completionWidgets(update.view);
    }
  }
}, {
  decorations: v => v.decorations,
});