import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { alias, and, empty, equal, gt, mapBy, not, notEmpty, oneWay, or, reads } from 'ember-decorators/object/computed';

export default Component.extend({
  @service scroller: null,
  @service('broadcasts') broadcastsService: null,

  @controller('intersectionality') intersectionalityController: null,

  @alias('audreLorde') lorde: null,
  @empty('oppressions') liberation: null,
  @not('patriarchal') feminist: null,
  @notEmpty('oppressions') continueTheStruggle: null,
  @reads('intersectionalityController.oppressions') oppressions: null,

  @gt('oppressions.length', 1) applyIntersectionalAnalysis: null,
  @equal('oppressions.length', 1) singleIssue: null,

  @mapBy('oppressions', 'axis') axes: null,

  @and('feminist', 'liberation') consistent: null,
  @or('patriarchal', 'feminist') tautological: null,

  @oneWay('intersectionalityController.oppressions') oppressionsAgain: null,

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
