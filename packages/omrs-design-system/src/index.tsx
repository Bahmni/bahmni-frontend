import React from 'react'
import FloatingOrderBasketButton from './components/floating-order-basket-button/floating-order-basket-button.component'
import {orderBasketStore} from './state/order-basket-store'
import {Provider} from 'unistore/react'
import './i18n/config'
import OrderBasket from './components/order-basket/order-basket.component_old'

const App = () => {
  return (
    <div>
      <h1>Hello OMRS</h1>
      <Provider store={orderBasketStore}>
        <div>
          <OrderBasket />
          <FloatingOrderBasketButton />
        </div>
      </Provider>
    </div>
  )
}

export default App
