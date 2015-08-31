/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import View from 'ampersand-view';
import mustache from 'mustache';

export default View.extend({
  template: mustache.render(`<section class="page" data-hook="not-found-page">
                               <h1>404 wut</h1>
                             </section>`)
});
