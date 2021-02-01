// @ts-check
/// <reference types="cypress" />
const fs = require('fs')
const path = require('path')
const { startDevServer } = require('@cypress/webpack-dev-server')

/** @type {Cypress.PluginConfig} */
module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    // yarn tsc webpack.config.ts --esModuleInterop
    const config = path.resolve(__dirname, '..', '..', 'webpack.config.ts')

    return startDevServer({
      webpackConfig: require(config).default,
      options,
    })
  })

  on('task', {
    getDummySpecs: () => {
      const dummyDir = path.resolve(__dirname, '..', 'component', 'dummy_specs')

      return fs
      .readdirSync(dummyDir)
      .map((filename) => {
        const absolute = path.join(dummyDir, filename)

        return {
          absolute,
          relative: path.relative(path.resolve(__dirname, '..', '..'), absolute),
          name: filename,
        }
      })
    },
  })

  return config
}
