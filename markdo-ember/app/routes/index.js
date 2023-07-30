import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  model() {
    return `Test markdo document.

# Features
[ ] Highlight basic markdown
[ ] Add annotations for tasks
[x] Tab handling
    [x] Indent 4 spaces at a time with tab key
    [x] Outdent 4 spaces at a time with shift-tab key

## Handle nested headings
With text in them.

[ ] And tasks!

# PR
[ ] Set up a webpage
`;
  }
}
