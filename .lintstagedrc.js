module.exports = {
  '*.css': ['prettier --write'],
  '*.js': ['eslint --fix', 'prettier --write'],
  '*.json': ['prettier --write'],
};
