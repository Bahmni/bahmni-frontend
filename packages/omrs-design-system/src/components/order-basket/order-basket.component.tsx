import React from 'react'
import {connect} from 'unistore/react'
import {
  OrderBasketStoreActions,
  OrderBasketStore,
  orderBasketStoreActions,
} from '../../state/order-basket-store'

interface OrderBasketProps {}

const OrderBasket = connect<
  OrderBasketProps,
  OrderBasketStoreActions,
  OrderBasketStore,
  {}
>(
  'showBasket',
  orderBasketStoreActions,
)(({showBasket}: OrderBasketProps & OrderBasketStore) => {
  return showBasket ? <h1>This is your Order Basket</h1> : <></>
})

export default OrderBasket
