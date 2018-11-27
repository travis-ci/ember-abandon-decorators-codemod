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

  return root.toSource({ quote: 'single' });
}