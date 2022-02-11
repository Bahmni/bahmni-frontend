import React from 'react'
import ReactDOM from 'react-dom'
import App from './src'

const host = document.querySelector('#omrs-order-basket')
const shadowRoot = host.attachShadow({mode: 'open'})
const renderIn = document.createElement('div')

var carbonStyles = document.createElement('link')
carbonStyles.type = 'text/css'
carbonStyles.rel = 'stylesheet'
carbonStyles.href =
  'https://unpkg.com/carbon-components@10.50.0/css/carbon-components.css'

shadowRoot.appendChild(carbonStyles)
shadowRoot.appendChild(renderIn)

ReactDOM.render(<App />, renderIn)
