import Router from 'ampersand-router';
import HomePage from '../views/home_page';
import ExperimentPage from '../views/experiment_page';

// TODO: fxa integration
const loggedIn = false;

export default Router.extend({
  routes: {
    '': 'home',
    'experiments/:experiment': 'experimentDetail',
    'settings': 'settings',
    '404': 'notFound'
  },

  experimentDetail(experiment) {
    // if the experiment exists, load a detail page; else, 404
    let exp = app.experiments.get(experiment, 'name');
    if (exp) {
      let experimentPage = new ExperimentPage({experiment: exp});
      this.trigger('newPage', experimentPage);
    } else {
      this.redirectTo('404');
    }
  },

  home() {
    this.trigger('newPage', new HomePage({experiments: app.experiments }));
  },

  settings() {
    if (app.me.loggedIn) {
      this.trigger('settings', new SettingsPage());
    } else {
      this.redirectTo('');
    }
  },

  notFound() {
    this.trigger('newPage', new NotFoundPage());
  }

});
