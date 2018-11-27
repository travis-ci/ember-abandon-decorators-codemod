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

  let macros = root.find(j.ObjectProperty, (property) => {
    if (!property.decorators) {
      return false;
    }

    let decorator = property.decorators[0];

    return decorator && ['alias', 'not'].includes(decorator.expression.callee.name);
  });

  macros.forEach((injection) => {
    let key = j.identifier(injection.value.key.name);
    let value = j.callExpression(j.identifier(injection.value.decorators[0].expression.callee.name), [j.literal(injection.value.decorators[0].expression.arguments[0].value)]);
    injection.replace(j.objectProperty(key, value));
  });

  return root.toSource({ quote: 'single' });
}