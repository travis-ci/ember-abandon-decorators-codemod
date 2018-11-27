const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  let j = getParser(api);
  let root = j(file.source);

  let serviceImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/service' }
  });

  serviceImportStatements.forEach((importStatement) => {
    let variable = [j.importSpecifier(j.identifier('inject'), j.identifier('service'))];
  
    importStatement.replace(j.importDeclaration(variable, j.literal('@ember/service')));
  });

  let serviceInjections = root.find(j.ObjectProperty, {
    decorators: [{ type: 'Decorator', expression: { type: 'Identifier', name: 'service'} }]
  });

  serviceInjections.forEach((injection) => {
    let key = j.identifier(injection.value.key.name);
    let value = j.callExpression(j.identifier('service'), []);
    injection.replace(j.objectProperty(key, value));
  });

  let renamedServiceInjections = root.find(j.ObjectProperty, {
    decorators: [{type: 'Decorator', expression: { type: 'CallExpression', callee: { type: 'Identifier', name: 'service' }}}]
  });

  renamedServiceInjections.forEach((injection) => {
    let key = j.identifier(injection.value.key.name);
    let value = j.callExpression(j.identifier('service'), [j.literal(injection.value.decorators[0].expression.arguments[0].value)]);
    injection.replace(j.objectProperty(key, value));
  });

  let controllerImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/controller' }
  });

  controllerImportStatements.forEach((importStatement) => {
    let variable = [j.importSpecifier(j.identifier('inject'), j.identifier('controller'))];
  
    importStatement.replace(j.importDeclaration(variable, j.literal('@ember/controller')));
  });

  let renamedControllerInjections = root.find(j.ObjectProperty, {
    decorators: [{type: 'Decorator', expression: { type: 'CallExpression', callee: { type: 'Identifier', name: 'controller' }}}]
  });

  renamedControllerInjections.forEach((injection) => {
    let key = j.identifier(injection.value.key.name);
    let value = j.callExpression(j.identifier('controller'), [j.literal(injection.value.decorators[0].expression.arguments[0].value)]);
    injection.replace(j.objectProperty(key, value));
  });

  let macroImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/object/computed' }
  });

  macroImportStatements.forEach((importStatement) => {
    let variable = importStatement.value.specifiers;
  
    importStatement.replace(j.importDeclaration(variable, j.literal('@ember/object/computed')));
  });

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

  macros.forEach((injection) => {
    let key = j.identifier(injection.value.key.name);

    let valueArguments = injection.value.decorators[0].expression.arguments;
    let value = j.callExpression(j.identifier(injection.value.decorators[0].expression.callee.name), valueArguments);
    injection.replace(j.objectProperty(key, value));
  });

  let attrImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/data' }
  });

  attrImportStatements.forEach((importStatement) => {
    let variable = importStatement.value.specifiers[0].imported.name;
  
    importStatement.replace(j.importDeclaration([j.importDefaultSpecifier(j.identifier(variable))], j.literal('ember-data/attr')));
  });

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

  return root.toSource({ quote: 'single' });
}