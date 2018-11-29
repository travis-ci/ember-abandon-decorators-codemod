import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { alias, and, empty, equal, filter, filterBy, gt, mapBy, not, notEmpty, oneWay, or, reads, sort } from 'ember-decorators/object/computed';
import { attr } from 'ember-decorators/data';
import { action } from 'ember-decorators/object';
import { computed } from 'ember-decorators/object';

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

  @filterBy('intersectionalityController.perceivedOppressions', 'hasInstitutionalPower', false) trueOppressions: null,

  @filter('intersectionalityController.perceivedOppressions', (oppression) => ['reverse-racism', 'misandry'].includes(oppression.axis)) someFakeOppressions: null,

  @sort('oppressions', (a, b) => {
    return Math.random();
  })
  oppressionOlympics: null,

  @attr untypedAttr: '',
  @attr('string') typedAttr: null,

  @action
  joinTheResistance(name, location) {
    alert(`Thanks for joining the struggle, ${name} from ${location}!`);
  },

  @action
  learn() {
    this.increment('learning');
  },

  @computed()
  whiteSupremacy() {
    return '👎';
  },

  @computed('typedAttr')
  typedAttrAccess() {
    console.log('typedAttr!');
  },

  @computed('lorde')
  lordeLorde(audreLorde = 'excellent') {
    return audreLorde*2;
  },

  @computed('whiteSupremacy.{slaveryCapitalism,genocideColonialism,orientalismWar}')
  smithThreePillars(slaveryCapitalism, genocideColonialism, orientalismWar) {
    return NaN;
  },

  @computed('axes.[]')
  sortedAxes(axes) {
    return axes.sort();
  },

  @computed('oppressions.@each.{hasInstitutionalPower,axis}')
  somethinglol(oppressions) {
    return NaN;
  },

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
