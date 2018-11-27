import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { alias, empty, not, reads } from 'ember-decorators/object/computed';

export default Component.extend({
  @service scroller: null,
  @service('broadcasts') broadcastsService: null,

  @controller('intersectionality') intersectionalityController: null,

  @alias('audreLorde') lorde: null,
  @empty('oppressions') liberation: null,
  @not('patriarchal') feminist: null,
  @reads('intersectionalityController.oppressions') oppressions: null,

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
