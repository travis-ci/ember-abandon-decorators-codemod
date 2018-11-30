# decorators


## Usage

```
npx ember-abandon-decorators-codemod decorators path/of/files/ or/some**/*glob.js

# or

yarn global add ember-abandon-decorators-codemod
ember-abandon-decorators-codemod decorators path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/decorators/__testfixtures__/basic.input.js)</small>):
```js
import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { alias, and, empty, equal, filter, filterBy, gt, mapBy, not, notEmpty, oneWay, or, reads, sort } from 'ember-decorators/object/computed';
import { attr } from 'ember-decorators/data';
import { action } from 'ember-decorators/object';
import { computed } from 'ember-decorators/object';
import { action, computed, observes } from 'ember-decorators/object';

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

  @not('whiteSupremacy.genocideColonialism') 'aria-dismantle-settler-colonialism': null,

  @computed('whiteSupremacy.slaveryCapitalism')
  'a-dasherised-pillar'(slaveryCapitalism) {
    return slaveryCapitalism;
  },

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});

```

**Output** (<small>[basic.input.js](transforms/decorators/__testfixtures__/basic.output.js)</small>):
```js
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
import { computed, observer } from '@ember/object';

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
    let audreLorde = this.get('lorde') || 'excellent';
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

  sortedAxes: computed('axes.[]', function() {
    let axes = this.get('axes');
    return axes.sort();
  }),

  somethinglol: computed('oppressions.@each.{hasInstitutionalPower,axis}', function() {
    let oppressions = this.get('oppressions');
    return NaN;
  }),

  'aria-dismantle-settler-colonialism': not('whiteSupremacy.genocideColonialism'),

  'a-dasherised-pillar': computed('whiteSupremacy.slaveryCapitalism', function() {
    let slaveryCapitalism = this.get('whiteSupremacy.slaveryCapitalism');
    return slaveryCapitalism;
  }),

  didInsertElement() {
    this._super(...arguments);
    this.scroller.scrollToElement(this.element);
  }
});

```
<!--FIXTURE_CONTENT_END-->