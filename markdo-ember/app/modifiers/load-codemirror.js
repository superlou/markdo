import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { basicSetup } from 'codemirror';
import { EditorState, StateField } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { standardKeymap, indentWithTab } from '@codemirror/commands';
import { indentUnit } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';

export default class LoadCodemirrorModifier extends Modifier {
  editorView = null;

  modify(element, positional /*, named*/) {
    let source = positional[0];
    let onSave = positional[1];
    
    let saveCommand = keymap.of([{
      key: 'Ctrl-s',
      run: (target) => {
        onSave(target.state.doc.toString());
        return true;
      },
    }]);

    let extensions = [
      basicSetup,
      saveCommand,
      keymap.of([indentWithTab]),
      indentUnit.of("    "),
    ];

    let state = EditorState.create({
      doc: source,
      extensions: extensions,
    });

    if (this.editorView === null) {
      this.editorView = new EditorView({
        parent: element,
        state: state,
      });
      registerDestructor(this, cleanup);
    } else {
      this.editorView.setState(state);
    }
  }
}

function cleanup(instance) {
  let { element, event, handler } = instance;
  this.editorView.destroy();
}
