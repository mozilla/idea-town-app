/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import app from 'ampersand-app';
import Router from 'ampersand-router';
import HomePage from '../views/home_page';
import ExperimentPage from '../views/experiment_page';
import SettingsPage from '../views/settings_page';
import NotFoundPage from '../views/not_found_page';

export default Router.extend({
  routes: {
    '': 'home',
    'experiments/:experiment': 'experimentDetail',
    'settings': 'settings',
    '404': 'notFound'
  },

  experimentDetail(experiment) {
    // if the experiment exists, load a detail page; else, 404
    const exp = app.experiments.get(experiment, 'name');
    if (exp) {
      const experimentPage = new ExperimentPage({experiment: exp});
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
