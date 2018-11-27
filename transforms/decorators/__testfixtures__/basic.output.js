import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  scroller: service(),
  broadcastsService: service('broadcasts'),

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
