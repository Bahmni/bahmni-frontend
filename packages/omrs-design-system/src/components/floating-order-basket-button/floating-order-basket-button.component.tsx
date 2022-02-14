import React from 'react'
import ShoppingBag16 from '@carbon/icons-react/es/shopping--bag/16'
import {Button, Tag} from 'carbon-components-react'
import {useTranslation} from 'react-i18next'
import {connect} from 'unistore/react'
import {
  OrderBasketStoreActions,
  OrderBasketStore,
  orderBasketStoreActions,
} from '../../state/order-basket-store'
import {css} from '@emotion/css'
import styled from '@emotion/styled'
import {events, trigger} from '../../events/customEvents'

export interface FloatingOrderBasketButtonProps {}

//css helper example - injected via className
const floatingOrderBasketButton = css({
  position: 'fixed',
  bottom: '1rem',
  right: '3rem',
  height: '56px',
  fontWeight: 'bold',
  paddingRight: '15px !important',
  zIndex: 1,
})

//styled example
const OrderBasketSvg = styled(ShoppingBag16)({
  margin: 'auto 10px auto 20px',
})

const elementContainer = css({
  display: 'flex',
})

const CountTag = styled(Tag)({
  position: 'absolute',
  top: '0px',
  right: '7px',
  transform: 'scale(0.8)',
  minWidth: 'initial',
  minHeight: 'initial',
  backgroundColor: 'red',
  color: 'white',
})

const FloatingOrderBasketButton = connect<
  FloatingOrderBasketButtonProps,
  OrderBasketStoreActions,
  OrderBasketStore,
  {}
>(
  ['items', 'showBasket'],
  orderBasketStoreActions,
)(
  ({
    items,
    showBasket,
    shouldShowBasket,
  }: FloatingOrderBasketButtonProps &
    OrderBasketStore &
    OrderBasketStoreActions) => {
    const {t, i18n} = useTranslation()
    if (!showBasket)
      return (
        <Button
          kind="secondary"
          className={floatingOrderBasketButton}
          onClick={() => {
            shouldShowBasket(!showBasket)
            trigger(events.openActionPad, {})
            console.log(`Creating CustomEvent 'open-order-basket'`)
          }}
        >
          <div className={elementContainer}>
            <span>{t('orderBasket')}</span>
            <OrderBasketSvg />
            {items.length > 0 && <CountTag>{items.length}</CountTag>}
          </div>
        </Button>
      )
    return <></>
  },
)

export default FloatingOrderBasketButton
