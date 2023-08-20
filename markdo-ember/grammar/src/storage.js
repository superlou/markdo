import {EditorView} from "@codemirror/view";

export let localStorageSaveOnChange = EditorView.updateListener.of(update => {
  // todo This should be debounced.
  if (update.docChanged > 0) {
    let doc = update.state.doc.toString();
    window.localStorage.doc = doc;
  }
});

export let localStorageLoad = window.localStorage.doc;

let example = `Initial description.

# Features
[x] Use "#" for headings instead of "=".
    8/18/23 It was because of the external tokenizer.
[ ] Recognize updates.
    8/19/23 I needed to account for single-number parts. However, multiple updates don't work.
    8/18/23 It seems to be chosing paragraph instead of Update.

## Heading 1.1
Content

[ ] Task 1
[ ] Task 2
    Descriptive text for Task 2.
    [x] Subtask 2.1 has additional text
        And it contains notes!
        Notes can go across two lines.
        For some reason they include the leading tabs... after the first line.
    [ ] This task is still open.
    This descriptive text is for Task 2.
`;