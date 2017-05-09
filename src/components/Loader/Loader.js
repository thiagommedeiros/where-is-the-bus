import React from 'react'
import { connect } from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'

import styles from './Loader.css'

const Loader = ({ visible, text }) => {

  const classNames = () => {
    return [
      styles.wrapper,
      !visible ? styles.hidden : ''
    ].join(' ')
  }

  return (
    <div className={classNames()} style={{height: window.innerHeight}}>
      <div className={styles.spin}>
        <CircularProgress
          size={60}
          thickness={11}
        />
        <span className={styles.text}>{text}</span>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  visible: state.loaderState.visible,
  text: state.loaderState.text
})

export default connect(mapStateToProps)(Loader)
