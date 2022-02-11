import React from 'react'
import {Provider} from 'unistore/react'
import FloatingOrderBasketButton from './components/floating-order-basket-button/floating-order-basket-button.component'
import OrderBasket from './components/order-basket/order-basket.component'
import ActionPadContainer from './components/action-pad/action-pad-container'
import {events, trigger} from './events/customEvents'
import './i18n/config'
import {orderBasketStore} from './state/order-basket-store'

const App = () => {
  return (
    <Provider store={orderBasketStore}>
      <div>
        <ActionPadContainer title="Consultation Pad">
          <OrderBasket
            patientUuid="a751f0da-39ab-45a3-db52-21706f5ed201"
            closeWorkspace={() => trigger(events.closeActionPad, {})}
          />
        </ActionPadContainer>
        <FloatingOrderBasketButton />
      </div>
    </Provider>
  )
}

export default App
