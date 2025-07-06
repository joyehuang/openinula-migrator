const recast = require('recast');

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  let fileModified = false;

  // Transform useState
  root.find(j.VariableDeclaration).forEach(path => {
    const decl = path.node.declarations[0];
    if (
      decl &&
      j.ArrayPattern.check(decl.id) &&
      decl.id.elements.length === 2 &&
      decl.init &&
      j.CallExpression.check(decl.init) &&
      decl.init.callee.name === 'useState'
    ) {
      const varName = decl.id.elements[0].name;
      const initValue = decl.init.arguments[0];
      const newDecl = j.variableDeclaration('let', [
        j.variableDeclarator(j.identifier(varName), initValue)
      ]);
      j(path).replaceWith(newDecl);
      fileModified = true;
    }
  });

  // Remove import if needed
  if (fileModified) {
    root
      .find(j.ImportDeclaration, { source: { value: 'openinula' } })
      .forEach(path => {
        const newSpecifiers = path.node.specifiers.filter(s => s.imported.name !== 'useState');
        if (newSpecifiers.length > 0) {
          path.node.specifiers = newSpecifiers;
        } else {
          j(path).remove();
        }
      });
  }

  if (fileModified) {
    // Force a format change to ensure jscodeshift detects the modification.
    return recast.print(root.get().node, { tabWidth: 4, quote: 'single' }).code;
  }

  return fileInfo.source;
};
