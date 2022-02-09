import {createGlobalStore} from './state'
import {OrderBasketItem} from '../types/order-basket-item'

export interface OrderBasketStore {
  items: Array<OrderBasketItem>
  showBasket: Boolean
}

export interface OrderBasketStoreActions {
  setItems: (
    value: Array<OrderBasketItem> | (() => Array<OrderBasketItem>),
  ) => void
  shouldShowBasket: (value: Boolean) => void
}

export const orderBasketStore = createGlobalStore<OrderBasketStore>(
  'drug-order-basket',
  {
    items: [],
    showBasket: false,
  },
)

export const orderBasketStoreActions = {
  setItems(
    _: OrderBasketStore,
    value: Array<OrderBasketItem> | (() => Array<OrderBasketItem>),
  ) {
    return {items: typeof value === 'function' ? value() : value}
  },
  shouldShowBasket(_: OrderBasketStore, value: Boolean) {
    return {showBasket: value}
  },
}
