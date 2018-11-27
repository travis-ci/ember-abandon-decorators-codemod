import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';

export default Component.extend({
  scroller: service(),
  broadcastsService: service('broadcasts'),

  intersectionalityController: controller('intersectionality'),

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
