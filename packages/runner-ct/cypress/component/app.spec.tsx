/* global cy */
import { action, observable } from 'mobx'
import React from 'react'
import { mount } from '@cypress/react'
import App from '../../src/app/app'
import State from '../../src/lib/state'

class MockEventManager {
  start = () => {}
  on = () => {}
}

describe('App', () => {
  it('closes the spec list when selecting a spec', () => {
    class StateWithSpecs extends State {
      constructor () {
        super({ reporterWidth: 100 })
      }

      specs = observable(
        [
          {
            relative: 'relative',
            absolute: 'absolute',
            name: 'This is a spec',
          },
        ],
      )

      initializePlugins = action(() => { /* stub */ })
      setSingleSpec = action(() => { /* stub */ })
    }

    mount(
      <App
        state={new StateWithSpecs()}
        // @ts-ignore - this is difficult to stub. Real one breaks things.
        eventManager={new MockEventManager()}
        config={{ projectName: 'Project' }}
      />,
    )

    cy.get('[aria-label="Close the menu"]')
    cy.get('[role="unselected-spec"]').contains('This is a spec').click()
    cy.get('[aria-label="Open the menu"]')
  })
})
