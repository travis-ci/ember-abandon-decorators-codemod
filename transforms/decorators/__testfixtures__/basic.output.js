import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { alias, and, empty, mapBy, not, or, reads } from '@ember/object/computed';

export default Component.extend({
  scroller: service(),
  broadcastsService: service('broadcasts'),

  intersectionalityController: controller('intersectionality'),

  lorde: alias('audreLorde'),
  liberation: empty('oppressions'),
  feminist: not('patriarchal'),
  oppressions: reads('intersectionalityController.oppressions'),

  axes: mapBy('oppressions', 'axis'),

  consistent: and('feminist', 'liberation'),
  tautological: or('patriarchal', 'feminist'),

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
