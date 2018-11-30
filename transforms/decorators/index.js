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
    let importName = [j.importSpecifier(j.identifier('inject'), j.identifier('service'))];
    let importSource = j.literal('@ember/service');
  
    importStatement.replace(j.importDeclaration(importName, importSource));
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
    let propertyName = j.identifier(injection.value.key.name);
    let injectionCall = j.callExpression(j.identifier('service'), []);
    injection.replace(j.objectProperty(propertyName, injectionCall));
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
    let propertyName = j.identifier(injection.value.key.name);

    let controllerName = j.literal(injection.value.decorators[0].expression.arguments[0].value);
    let injectionCall = j.callExpression(j.identifier('service'), [controllerName]);

    injection.replace(j.objectProperty(propertyName, injectionCall));
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
    let importName = [j.importSpecifier(j.identifier('inject'), j.identifier('controller'))];
    let importSource = j.literal('@ember/controller');
  
    importStatement.replace(j.importDeclaration(importName, importSource));
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
    let propertyName = j.identifier(injection.value.key.name);

    let controllerName = j.literal(injection.value.decorators[0].expression.arguments[0].value);
    let injectionCall = j.callExpression(j.identifier('controller'), [controllerName]);

    injection.replace(j.objectProperty(propertyName, injectionCall));
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
    let importNames = importStatement.value.specifiers;
    let importSource = j.literal('@ember/object/computed');
  
    importStatement.replace(j.importDeclaration(importNames, importSource));
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
    let propertyName = macro.value.key;

    let macroArguments = macro.value.decorators[0].expression.arguments;
    let macroName = j.identifier(macro.value.decorators[0].expression.callee.name);
    let macroCall = j.callExpression(macroName, macroArguments);
    macro.replace(j.objectProperty(propertyName, macroCall));
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
    let importName = j.identifier(importStatement.value.specifiers[0].imported.name);
    let importSource = j.literal('ember-data/attr');
  
    importStatement.replace(j.importDeclaration([j.importDefaultSpecifier(importName)], importSource));
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

    let propertyName = j.identifier(attr.value.key.name);

    let attrArguments = decoratorExpression.callee ? decoratorExpression.arguments : [];
    let attrCall = j.callExpression(j.identifier('attr'), attrArguments);

    attr.replace(j.objectProperty(propertyName, attrCall));
  });

  /*
   * import { action } from 'ember-decorators/object';
   * is removed
   * 
   * import { action, computed, observes } from 'ember-decorators/object'
   * becomes
   * import { computed, observer } from '@ember/object'
   */

  root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/object' }
  }).forEach(computedImport => {
    let importNames = [];

    computedImport.value.specifiers.forEach(specifier => {
      if (specifier.imported.name !== 'action') {
        if (specifier.imported.name === 'observes') {
          specifier.imported.name = 'observer';
        }
        importNames.push(specifier);
      }
    });
    let importSource = j.literal('@ember/object');
  
    if (importNames.length > 0) {
      computedImport.replace(j.importDeclaration(importNames, importSource));
    } else {
      computedImport.prune();
    }
  });

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
    let actionMethods = [];
    actions.forEach(action => {
      actionMethods.push(j.objectMethod('method', j.identifier(action.value.key.name), action.value.params, action.value.body));
    });

    let actionMethodsObject = j.objectExpression(actionMethods);

    actions.forEach((action, index) => {
      if (index == 0) {
        action.replace(j.objectProperty(j.identifier('actions'), actionMethodsObject))
      } else {
        action.prune();
      }
    });
  }

  /*
   * @observes('tautological')
   * noteParadox() {
   *   alert('what does it all mean');
   * }
   * becomes
   * noteParadox: observer('tautological', function() {
   *  alert('what does it all mean');
   * })
   */

  let observers = root.find(j.ObjectMethod, {
    decorators: [{type: 'Decorator', expression: { type: 'CallExpression', callee: { type: 'Identifier', name: 'observes' }}}]
  });

  if (observers.length > 0) {
    observers.forEach(observer => {
      let propertyName = observer.value.key;
      let decorator = observer.value.decorators[0];

      let functionDeclaration = j.functionExpression(null, [], observer.value.body);
      let observerCall = j.callExpression(j.identifier('observer'), [...decorator.expression.arguments, functionDeclaration]);
  
      observer.replace(j.objectProperty(propertyName, observerCall));
    });
  }

  // FIXME add description

  let computeds = root.find(j.ObjectMethod, {
    decorators: [{type: 'Decorator', expression: { type: 'CallExpression', callee: { type: 'Identifier', name: 'computed' }}}]
  });

  computeds.forEach(computed => {
    let propertyName = computed.value.key;
    let decorator = computed.value.decorators[0];

    let expandedDecoratorArguments = [];

    decorator.expression.arguments.forEach(argument => {
      let value = argument.value;

      if (value.indexOf('@each') !== -1) {
        expandedDecoratorArguments.push(value.substring(0, value.indexOf('.@each')));
      } else if (value.indexOf('{') !== -1) {
        let root = value.substring(0, value.indexOf('{'));
        let insideBrackets = value.substring(value.indexOf('{') + 1, value.indexOf('}'));

        insideBrackets.split(',').forEach(key => expandedDecoratorArguments.push(`${root}${key}`));
      } else if (value.indexOf('.[]') !== -1) {
        expandedDecoratorArguments.push(value.replace('.[]', ''));
      } else {
        expandedDecoratorArguments.push(value);
      }
    });

    let declarations = [];

    computed.value.params.forEach((param, index) => {
      let decoratorArgument = expandedDecoratorArguments[index];
      let getCall = j.callExpression(j.memberExpression(j.thisExpression(), j.identifier('get')), [j.literal(decoratorArgument)]);

      let declaration;

      if (param.type === 'Identifier') {
        declaration = j.variableDeclaration('let', [j.variableDeclarator(j.identifier(param.name), getCall)]);
      } else if (param.type === 'AssignmentPattern') {
        // (something = 'default') becomes let something = this.get('something') || 'default'

        let assignment = param;

        let orExpression = j.logicalExpression('||', getCall, assignment.right);
        declaration = j.variableDeclaration('let', [j.variableDeclarator(j.identifier(assignment.left.name), orExpression)])
      }

      declarations.push(declaration);
    });

    let blockStatement = j.blockStatement([...declarations, ...computed.value.body.body]);
    let functionDeclaration = j.functionExpression(null, [], blockStatement);

    let computedCall = j.callExpression(j.identifier('computed'), [...decorator.expression.arguments, functionDeclaration]);

    computed.replace(j.objectProperty(propertyName, computedCall));
  });

  return root.toSource({ quote: 'single' });
}