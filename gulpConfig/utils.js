const path = require('path');

const cwd = process.cwd();


function resolve(moduleName) {
  return require.resolve(moduleName);
}

function getProjectPath(...filePath) {
  return path.join(cwd, ...filePath);
}

function cssInjection(content) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.scss/g, '.css');
}

module.exports = { resolve, getProjectPath, cssInjection };