const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  let j = getParser(api);
  let root = j(file.source);

  /*
   * import { service } from 'ember-decorators/service';
   * becomes
   * import { inject as service } from '@ember/service';
  */

  let serviceImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/service' }
  });

  serviceImportStatements.forEach((importStatement) => {
    let variable = [j.importSpecifier(j.identifier('inject'), j.identifier('service'))];
  
    importStatement.replace(j.importDeclaration(variable, j.literal('@ember/service')));
  });

  /*
   * @service scroller: null,
   * becomes
   * scroller: service(),
   */

  let serviceInjections = root.find(j.ObjectProperty, {
    decorators: [{ type: 'Decorator', expression: { type: 'Identifier', name: 'service'} }]
  });

  serviceInjections.forEach((injection) => {
    let key = j.identifier(injection.value.key.name);
    let value = j.callExpression(j.identifier('service'), []);
    injection.replace(j.objectProperty(key, value));
  });

  /*
   * @service('broadcasts') broadcastsService: null,
   * becomes
   * broadcastsService: service('broadcasts'),
   */

  let renamedServiceInjections = root.find(j.ObjectProperty, {
    decorators: [{type: 'Decorator', expression: { type: 'CallExpression', callee: { type: 'Identifier', name: 'service' }}}]
  });

  renamedServiceInjections.forEach((injection) => {
    let key = j.identifier(injection.value.key.name);
    let value = j.callExpression(j.identifier('service'), [j.literal(injection.value.decorators[0].expression.arguments[0].value)]);
    injection.replace(j.objectProperty(key, value));
  });

  /*
   * import { controller } from 'ember-decorators/controller';
   * becomes
   * import { inject as controller } from '@ember/controller';
   */

  let controllerImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/controller' }
  });

  controllerImportStatements.forEach((importStatement) => {
    let variable = [j.importSpecifier(j.identifier('inject'), j.identifier('controller'))];
  
    importStatement.replace(j.importDeclaration(variable, j.literal('@ember/controller')));
  });

  /*
   * @controller('intersectionality') intersectionalityController: null,
   * becomes
   * intersectionalityController: controller('intersectionality'),
   */

  let renamedControllerInjections = root.find(j.ObjectProperty, {
    decorators: [{type: 'Decorator', expression: { type: 'CallExpression', callee: { type: 'Identifier', name: 'controller' }}}]
  });

  renamedControllerInjections.forEach((injection) => {
    let key = j.identifier(injection.value.key.name);
    let value = j.callExpression(j.identifier('controller'), [j.literal(injection.value.decorators[0].expression.arguments[0].value)]);
    injection.replace(j.objectProperty(key, value));
  });

  /*
   * import { alias, sort } from 'ember-decorators/object/computed';
   * becomes
   * import { alias, sort } from '@ember/object/computed';
   */

  let macroImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/object/computed' }
  });

  macroImportStatements.forEach((importStatement) => {
    let variable = importStatement.value.specifiers;
  
    importStatement.replace(j.importDeclaration(variable, j.literal('@ember/object/computed')));
  });

  /*
   * @sort('oppressions', (a, b) => {
   *   return Math.random();
   * })
   * oppressionOlympics: null,
   * becomes
   * oppressionOlympics: sort('oppressions', (a, b) => {
   *   return Math.random();
   * }),
   */

  let selectedMacros = ['alias', 'and', 'empty', 'equal', 'filter', 'filterBy', 'gt', 'mapBy', 'not', 'notEmpty', 'oneWay', 'or', 'reads', 'sort'];

  let macros = root.find(j.ObjectProperty, (property) => {
    if (!property.decorators) {
      return false;
    }

    let decorator = property.decorators[0];

    return decorator &&
      decorator.expression.callee && // Ensures the decorator takes arguments
      selectedMacros.includes(decorator.expression.callee.name);
  });

  macros.forEach((macro) => {
    let key = j.identifier(macro.value.key.name);

    let valueArguments = macro.value.decorators[0].expression.arguments;
    let value = j.callExpression(j.identifier(macro.value.decorators[0].expression.callee.name), valueArguments);
    macro.replace(j.objectProperty(key, value));
  });

  /*
   * import { attr } from 'ember-decorators/data';
   * becomes
   * import attr from 'ember-data/attr';
   */

  let attrImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/data' }
  });

  attrImportStatements.forEach((importStatement) => {
    let variable = importStatement.value.specifiers[0].imported.name;
  
    importStatement.replace(j.importDeclaration([j.importDefaultSpecifier(j.identifier(variable))], j.literal('ember-data/attr')));
  });

  /*
   * @attr untypedAttr: '',
   * @attr('string') typedAttr: null,
   * become
   * untypedAttr: attr(),
   * typedAttr: attr('string'),
   */

  let attrs = root.find(j.ObjectProperty, (property) => {
    if (!property.decorators || !property.decorators[0]) {
      return false;
    }

    let decorator = property.decorators[0];

    return (decorator.expression.type == 'Identifier' && decorator.expression.name == 'attr') ||
      (decorator.expression.type == 'CallExpression' && decorator.expression.callee.name == 'attr')
  });

  attrs.forEach((attr) => {
    let decoratorExpression = attr.value.decorators[0].expression;

    let key = j.identifier(attr.value.key.name);

    let attrArguments = decoratorExpression.callee ? decoratorExpression.arguments : [];
    let value = j.callExpression(j.identifier('attr'), attrArguments);

    attr.replace(j.objectProperty(key, value));
  });

  /*
   * import { action } from 'ember-decorators/object';
   * is removed
   */

  root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/object' }
  }).forEach(actionImport => actionImport.prune());

  /*
   * @action
   * joinTheResistance(name, location) {
   *   alert(`Thanks for joining the struggle, ${name} from ${location}!`);
   * },
   * becomes
   * actions: {
   *   joinTheResistance(name, location) {
   *     alert(`Thanks for joining the struggle, ${name} from ${location}!`);
   *   },
   * }
   */

  let actions = root.find(j.ObjectMethod, {
    decorators: [{ type: 'Decorator', expression: { type: 'Identifier', name: 'action'} }]
  });

  if (actions.length > 0) {
    let methods = [];
    actions.forEach(action => {
      methods.push(j.objectMethod('method', j.identifier(action.value.key.name), action.value.params, action.value.body));
    });

    let innards = j.objectExpression(methods);

    actions.forEach((action, index) => {
      if (index == 0) {
        action.replace(j.objectProperty(j.identifier('actions'), innards))
      } else {
        action.prune();
      }
    });
  }

  return root.toSource({ quote: 'single' });
}