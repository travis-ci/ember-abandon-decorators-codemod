import Component from '@ember/component';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service scroller: null,
  @service('broadcasts') broadcastsService: null,

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
