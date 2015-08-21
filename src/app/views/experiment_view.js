import View from 'ampersand-view';
import dom from 'ampersand-dom';

export default View.extend({
  template: '<li>Experiment name: <span data-hook="name"></span></li>',
  bindings: {
    "model.name": {
      type: 'text',
      hook: 'name'
    }
  },
  initialize () {
    console.log('view initialized');
  }
});
