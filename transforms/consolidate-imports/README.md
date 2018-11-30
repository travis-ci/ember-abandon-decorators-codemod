# consolidate-imports


## Usage

```
npx ember-abandon-decorators-codemod consolidate-imports path/of/files/ or/some**/*glob.js

# or

yarn global add ember-abandon-decorators-codemod
ember-abandon-decorators-codemod consolidate-imports path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/consolidate-imports/__testfixtures__/basic.input.js)</small>):
```js
/* global feministkilljoy */
import { sort } from '@ember/object/computed';
import Controller from '@ember/controller';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

```

**Output** (<small>[basic.input.js](transforms/consolidate-imports/__testfixtures__/basic.output.js)</small>):
```js
/* global feministkilljoy */
import { sort, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { computed } from '@ember/object';

```
<!--FIXTURE_CONTENT_END-->