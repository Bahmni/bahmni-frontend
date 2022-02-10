import React from 'react'
import {Provider} from 'unistore/react'
import FloatingOrderBasketButton from './components/floating-order-basket-button/floating-order-basket-button.component'
import OrderBasket from './components/order-basket/order-basket.component'
import ActionPadContainer from './components/workspace/action-pad-container'
import './i18n/config'
import {orderBasketStore} from './state/order-basket-store'

const App = () => {
  return (
    <div>
      <Provider store={orderBasketStore}>
        <div>
          <ActionPadContainer title="Consultation Pad">
            <OrderBasket
              patientUuid="a751f0da-39ab-45a3-db52-21706f5ed201"
              closeWorkspace={() => {
                console.log('closing...')
              }}
            />
          </ActionPadContainer>
          <FloatingOrderBasketButton />
        </div>
      </Provider>
    </div>
  )
}

export default App
