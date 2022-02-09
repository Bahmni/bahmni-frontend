import React from 'react'
import FloatingOrderBasketButton from './components/floating-order-basket-button/floating-order-basket-button.component'
import {orderBasketStore} from './state/order-basket-store'
import {Provider} from 'unistore/react'
import './i18n/config'
import {CardHeader} from './components/cards'
import OrderBasket from './components/order-basket/order-basket.component'

const App = () => {
  return (
    <div>
      <h1>Hello OMRS</h1>
      <Provider store={orderBasketStore}>
        <div>
          <CardHeader title="My Card">
            <h1>This is My card body</h1>
          </CardHeader>
          <OrderBasket
            patientUuid="a751f0da-39ab-45a3-db52-21706f5ed201"
            closeWorkspace={() => {
              console.log('closing...')
            }}
          />
          <FloatingOrderBasketButton />
        </div>
      </Provider>
    </div>
  )
}

export default App
