import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { alias, and, empty, mapBy, not, or, reads } from 'ember-decorators/object/computed';

export default Component.extend({
  @service scroller: null,
  @service('broadcasts') broadcastsService: null,

  @controller('intersectionality') intersectionalityController: null,

  @alias('audreLorde') lorde: null,
  @empty('oppressions') liberation: null,
  @not('patriarchal') feminist: null,
  @reads('intersectionalityController.oppressions') oppressions: null,

  @mapBy('oppressions', 'axis') axes: null,

  @and('feminist', 'liberation') consistent: null,
  @or('patriarchal', 'feminist') tautological: null,

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
