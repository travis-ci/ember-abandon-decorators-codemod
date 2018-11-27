import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';

export default Component.extend({
  @service scroller: null,
  @service('broadcasts') broadcastsService: null,

  @controller('intersectionality') intersectionalityController: null,

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
