const fs = require('fs/promises');

const readFile = async (path) => {
  const content = await fs.readFile(path, 'utf-8');
  return JSON.parse(content);
};

const writeFile = async (path, content) => {
  await fs.writeFile(path, content);
};

module.exports = {
  readFile,
  writeFile,
};