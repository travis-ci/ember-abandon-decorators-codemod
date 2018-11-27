const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  let j = getParser(api);
  let root = j(file.source);

  let serviceImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-decorators/service' }
  });

  if (serviceImportStatements.length === 0) {
    return root.toSource({ quote: 'single' });
  }

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

  return root.toSource({ quote: 'single' });
}