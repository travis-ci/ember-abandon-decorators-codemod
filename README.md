# ember-abandon-decorators-codemod


A codemod to migrate away from 1.x Ember Decorators. Thanks to @rwjblue for [`codemod-cli`](https://github.com/rwjblue/codemod-cli) and @simonihmig for [`ember-test-helpers-codemod`](https://github.com/simonihmig/ember-test-helpers-codemod), which I looked to for guidance in this mysterious world of AST transforms.

This is set up to migrate [`travis-web`](https://github.com/travis-ci/travis-web), so it’s not universally-applicable. For instance, the codebase only uses four unary computed property macros: `alias`, `empty`, `not`, and `reads`, so if you use `bool`, it would skip that. It wouldn’t be hard to include others, so let me know if that would be useful for you!

This deletes whitespace that I don’t want deleted, at the moment… 😢

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-abandon-decorators-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-abandon-decorators-codemod
ember-abandon-decorators-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [consolidate-imports](transforms/consolidate-imports/README.md)
* [decorators](transforms/decorators/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`