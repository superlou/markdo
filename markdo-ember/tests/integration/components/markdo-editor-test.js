import { module, test } from 'qunit';
import { setupRenderingTest } from 'markdo-ember/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | markdo-editor', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<MarkdoEditor />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <MarkdoEditor>
        template block text
      </MarkdoEditor>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
