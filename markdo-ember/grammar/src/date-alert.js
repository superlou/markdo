import {EditorView, gutter, GutterMarker} from "@codemirror/view";
import {syntaxTree} from "@codemirror/language";
import {RangeSet} from "@codemirror/state"

const dateAlertMarker = new class extends GutterMarker {
  toDOM() {
    return document.createTextNode("⏰");
  }
}

function lineDueSoon(text) {
  let m = text.match(/by (\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})/);
  if (m === null) { return false; };
  
  let year = parseInt(m[3]);
  if (year < 70) {
    year += 2000;
  } else if (year < 100) {
    year += 1900;
  }
  
  let date = new Date(year, m[1] - 1, m[2] - 1);
    
  // todo This handles timezones incorrectly
  let now = new Date();
  let delta = (date - now) / 1000 / 60 / 60 / 24;
  
  return delta < 7;
}

function dateAlertMarkers(view) {
  let set = RangeSet.empty;
  
  for (let {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (nodeRef) => {
        if (nodeRef.name != "OpenTask") { return; }
        
        // todo Check for updates and snoozes
        // let block = nodeRef.node.getChild("Block");
        // if (block === null) { return; }
        
        // todo This should only use the task text
        let str = view.state.doc.sliceString(nodeRef.from, nodeRef.to);
        if (!lineDueSoon(str)) { return; };

        let lineFrom = view.state.doc.lineAt(nodeRef.from).from;
                        
        set = set.update({
          add: [dateAlertMarker.range(lineFrom)] 
        });
      }
    });
  }  
  return set;  
}

export const dateAlertGutter = gutter({
  class: "cm-date-alert-gutter",
  markers: (view) => dateAlertMarkers(view),
  initialSpacer: () => dateAlertMarker,
})