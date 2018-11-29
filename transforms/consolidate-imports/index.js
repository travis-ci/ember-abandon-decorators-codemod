const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  let j = getParser(api);
  let root = j(file.source);

  let importDeclarations = root.find(j.ImportDeclaration);

  let sourcesToDeclarations = {};

  importDeclarations.forEach(importDeclaration => {
    let source = importDeclaration.value.source.value;

    if (!sourcesToDeclarations[source]) {
      sourcesToDeclarations[source] = [];
    }

    sourcesToDeclarations[source].push(importDeclaration);
  });

  Object.keys(sourcesToDeclarations).forEach(source => {
    let declarations = sourcesToDeclarations[source];
    let specifiers = [];

    declarations.forEach(declaration => {
      specifiers = specifiers.concat(declaration.value.specifiers);
    });

    declarations.forEach((declaration, index) => {
      if (index === 0) {
        declaration.value.specifiers = specifiers;
      } else {
        declaration.prune();
      }
    });
  });

  return root.toSource({ quote: 'single' });
}