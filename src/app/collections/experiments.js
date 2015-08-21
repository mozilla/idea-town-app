import Collection from 'ampersand-collection';
import Experiment from '../models/experiment';

export default Collection.extend({
  model: Experiment,
  initialize () {
    console.log('experiments collection initialized');
  }
});
