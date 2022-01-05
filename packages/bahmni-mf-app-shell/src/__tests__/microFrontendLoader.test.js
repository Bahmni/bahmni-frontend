const jsdom = require('jsdom')
const {JSDOM} = jsdom
const fs = require('fs')
const path = require('path')
const html = fs.readFileSync(
  path.resolve(__dirname, '../__tests__/index.html'),
  'utf8',
)
let dom
let domDocument

function initializeDom() {
  return new Promise(resolve => {
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: `file://${path.resolve(__dirname, '../__tests__')}/`,
    })
    dom.window.document.addEventListener('DOMContentLoaded', () => {
      domDocument = dom.window.document
      resolve()
    })
  })
}

function attachContainers() {
  let rootElement = domDocument.createElement('div')

  let container1 = domDocument.createElement('div')
  container1.setAttribute('mf-container', 'test-container-1')
  rootElement.appendChild(container1)

  let container2 = domDocument.createElement('div')
  container2.setAttribute('mf-container', 'test-container-2')
  rootElement.appendChild(container2)

  domDocument.body.appendChild(rootElement)
}

async function waitForScriptLoad() {
  await new Promise(resolve => {
    setTimeout(resolve, 100)
  })
}

describe('Microfrontend Loader Tests', () => {
  beforeEach(() => initializeDom())

  test('should render mf in appropriate containers', async () => {
    attachContainers()

    await waitForScriptLoad()

    expect(
      domDocument.body
        .querySelector('#test-mf1')
        .querySelector('#test-mf1-element'),
    ).not.toBeNull()
    expect(
      domDocument.body
        .querySelector('#test-mf2')
        .querySelector('#test-mf2-element'),
    ).not.toBeNull()
    expect(domDocument.body.querySelector('#test-mf3')).toBeNull()
  })
})
