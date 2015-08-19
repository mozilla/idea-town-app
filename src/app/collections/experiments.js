import Collection from 'ampersand-collection';
import Experiment from '../models/experiment';

export default Collection.extend({
  model: Experiment,
  indexes: ['name'],
  initialize() {
    Collection.prototype.initialize.apply(this, arguments);
    console.log('experiments collection initialized');
  }
});
