import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { alias, not } from '@ember/object/computed';

export default Component.extend({
  scroller: service(),
  broadcastsService: service('broadcasts'),

  intersectionalityController: controller('intersectionality'),

  lorde: alias('audreLorde'),
  feminist: not('patriarchal'),

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
