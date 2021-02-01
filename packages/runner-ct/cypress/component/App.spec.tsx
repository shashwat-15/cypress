import * as React from 'react'
import { mount } from '@cypress/react'
import Container from '../../src/app/container'
import State from '../../src/lib/state'

type ContainerProps = { config: Cypress.ResolvedConfigOptions, state: State};
// This test suite is using specs from ../dummy_spec/* folder.
// It runs the root of runner-ct with special config and specs to mimic e2e tests
// Everything is bad: This file can contain only one test, cause cypress moves the focus to the internal test.
// If we fix this – we can move to the real e2e testing painless
describe('Root testing', () => {
  let specs: Cypress.Spec[]

  before(() => {
    cy.task('getDummySpecs')
    .then((dummySpecs) => {
      specs = dummySpecs as any

      cy.fixture('test1.html').then((html) => {
        specs.forEach((spec) => {
          cy.intercept(`/__cypress/iframes/${spec.relative}`, (res) => {
            res.reply((req) => {
              req.headers['content-type'] = 'text/html'
              req.body = html
            })
          })
        })
      })
    })
  })

  function mountRunnerCt (renderFn: (props: ContainerProps) => React.ReactNode) {
    cy.fixture('config.json').then((configWithoutSpecs) => {
      const state = new State({
        reporterWidth: 500,
        specs,
        spec: null,
      })

      const config = { ...configWithoutSpecs, specs }

      mount(
        renderFn({ config, state }),
        { stylesheets: ['/__cypress/runner/cypress_runner.css'] },
      )
    })
  }

  it('resets timing and stats when spec changed', () => {
    mountRunnerCt((props) => <Container {...props} />)

    cy.get('label[for="test1.spec.ts"]').click()
    cy.contains('.passed', '1')
    cy.contains('expected 2 to equal 2')
    cy.get('label[for="test2.spec.ts"]').click()
    cy.contains('.passed', '1')
    cy.get('label[for="test2.spec.ts"]').click()
    cy.contains('.passed', '1')
  })
})
