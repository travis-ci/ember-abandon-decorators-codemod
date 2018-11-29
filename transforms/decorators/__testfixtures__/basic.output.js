import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';

import {
  alias,
  and,
  empty,
  equal,
  filter,
  filterBy,
  gt,
  mapBy,
  not,
  notEmpty,
  oneWay,
  or,
  reads,
  sort,
} from '@ember/object/computed';

import attr from 'ember-data/attr';
import { computed } from '@ember/object';

export default Component.extend({
  scroller: service(),
  broadcastsService: service('broadcasts'),
  intersectionalityController: controller('intersectionality'),
  lorde: alias('audreLorde'),
  liberation: empty('oppressions'),
  feminist: not('patriarchal'),
  continueTheStruggle: notEmpty('oppressions'),
  oppressions: reads('intersectionalityController.oppressions'),
  applyIntersectionalAnalysis: gt('oppressions.length', 1),
  singleIssue: equal('oppressions.length', 1),
  axes: mapBy('oppressions', 'axis'),
  consistent: and('feminist', 'liberation'),
  tautological: or('patriarchal', 'feminist'),
  oppressionsAgain: oneWay('intersectionalityController.oppressions'),

  trueOppressions: filterBy(
    'intersectionalityController.perceivedOppressions',
    'hasInstitutionalPower',
    false
  ),

  someFakeOppressions: filter(
    'intersectionalityController.perceivedOppressions',
    (oppression) => ['reverse-racism', 'misandry'].includes(oppression.axis)
  ),

  oppressionOlympics: sort('oppressions', (a, b) => {
    return Math.random();
  }),

  untypedAttr: attr(),
  typedAttr: attr('string'),

  actions: {
    joinTheResistance(name, location) {
      alert(`Thanks for joining the struggle, ${name} from ${location}!`);
    },

    learn() {
      this.increment('learning');
    }
  },

  whiteSupremacy: computed(function() {
    return '👎';
  }),

  typedAttrAccess: computed('typedAttr', function() {
    console.log('typedAttr!');
  }),

  lordeLorde: computed('lorde', function() {
    let audreLorde = this.get('lorde');
    return audreLorde*2;
  }),

  smithThreePillars: computed(
    'whiteSupremacy.{slaveryCapitalism,genocideColonialism,orientalismWar}',
    function() {
      let slaveryCapitalism = this.get('whiteSupremacy.slaveryCapitalism');
      let genocideColonialism = this.get('whiteSupremacy.genocideColonialism');
      let orientalismWar = this.get('whiteSupremacy.orientalismWar');
      return NaN;
    }
  ),

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});
