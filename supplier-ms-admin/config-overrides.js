const path = require('path');
const {
  override,
  addWebpackAlias,
} = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    ['react']: path.resolve(__dirname, './node_modules/react'),
    ['@material-ui/core']: path.resolve(__dirname, './node_modules/@material-ui/core'),
    ['@material-ui/icons']: path.resolve(__dirname, './node_modules/@material-ui/icons'),
  }),
);
