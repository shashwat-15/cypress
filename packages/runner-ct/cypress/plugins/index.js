// @ts-check
/// <reference types="cypress" />
const path = require('path')
const { startDevServer } = require('@cypress/webpack-dev-server')

/** @type {Cypress.PluginConfig} */
module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    // yarn tsc webpack.config.ts --esModuleInterop
    const config = path.resolve(__dirname, '../../webpack.config.ts')

    return startDevServer({
      webpackConfig: require(config).default,
      options,
    })
  })

  return config
}
