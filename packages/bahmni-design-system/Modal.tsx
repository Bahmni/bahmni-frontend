import React from 'react'
const styles = {
  modal_container: {
    border: '2px solid #f4f4f4',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  } as React.CSSProperties,
  modal_content: {
    backgroundColor: '#fefefe',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '70%',
  },
  row: {
    marginBottom: '20px',
  },
  cancel_button: {
    backgroundColor: 'grey',
    color: 'black',
  },
  right_align: {
    textAlign: 'right',
  },
}

const Modal = ({children}) => {
  return (
    <div style={styles.modal_container}>
      <div style={styles.modal_content}>{children}</div>
    </div>
  )
}

export default Modal
