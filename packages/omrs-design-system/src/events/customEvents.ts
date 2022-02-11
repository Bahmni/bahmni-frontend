const events = {
  openActionPad: 'actionPad:open',
  closeActionPad: 'actionPad:close',
  minimizeOrderBasket: 'orderBasket:minimize',
}

function on(eventType, listener) {
  off(eventType, listener)
  document.addEventListener(eventType, listener)
}

function off(eventType, listener) {
  document.removeEventListener(eventType, listener)
}

function trigger(eventType, data) {
  const event = new CustomEvent(eventType, {detail: data})
  document.dispatchEvent(event)
}

export {on, off, trigger, events}
