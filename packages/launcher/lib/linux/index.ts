import { log } from '../log'
import { trim, tap } from 'ramda'
import { FoundBrowser, Browser } from '../types'
import { notInstalledErr } from '../errors'
import execa from 'execa'

const specialCharactersRe = /(["'$`\\])/g

function escapeShellPath(path: string) {
  // https://github.com/cypress-io/cypress/issues/3979
  // wrap the string in quotes and escape any special chars
  return `"${path.replace(specialCharactersRe, '\\$1')}"`
}

function getLinuxBrowser(
  name: string,
  binary: string,
  versionRegex: RegExp
): Promise<FoundBrowser> {
  const getVersion = (stdout: string) => {
    const m = versionRegex.exec(stdout)
    if (m) {
      return m[1]
    }
    log(
      'Could not extract version from %s using regex %s',
      stdout,
      versionRegex
    )
    throw notInstalledErr(binary)
  }

  const logAndThrowError = (err: Error) => {
    log(
      'Received error detecting browser binary: "%s" with error:',
      binary,
      err.message
    )
    throw notInstalledErr(binary)
  }

  return getVersionString(binary)
    .then(tap(log))
    .then(getVersion)
    .then((version: string) => {
      return {
        name,
        version,
        path: binary
      } as FoundBrowser
    })
    .catch(logAndThrowError)
}

export function getVersionString(path: string) {
  const escapedPath = escapeShellPath(path)
  const cmd = `${escapedPath} --version`
  log('finding version string using command "%s"', cmd)
  return execa
    .shell(cmd)
    .then(result => result.stdout)
    .then(trim)
}

export function detect(browser: Browser) {
  return getLinuxBrowser(
    browser.name,
    browser.binary as string,
    browser.versionRegex
  )
}
