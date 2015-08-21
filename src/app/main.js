import app from 'ampersand-app';

import ExperimentsCollection from './collections/experiments';
import ExperimentView from './views/experiment_view';

app.extend({
  initialize () {
    console.log('app initialize starting');
    // for now, instantiate the model with dummy data
    this.experiments = new ExperimentsCollection([
      { name: "Universal Search" },
      { name: "Side Tabs" },
      { name: "Snooze Tabs" },
      { name: "Cheese Tabs" }
    ]);
    this.view = new ExperimentView();
    this.view.renderCollection(this.experiments, ExperimentView, document.body);
    console.log('app initialize all done');
  }
});
app.initialize();

// expose app
window.app = app;
