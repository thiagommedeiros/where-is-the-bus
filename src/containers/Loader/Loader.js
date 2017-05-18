import React from 'react'
import { connect } from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'

import styles from './Loader.css'

const Loader = ({ visible, spin, text }) => {

  const classNames = () => {
    return [
      !visible ? styles.hidden : '',
      spin === 'small' ? styles.smallIsVisible : styles.bigIsVisible
    ].join(' ')
  }

  return (
    <div className={classNames()}>
      <div className={styles.bigSpin}>
        <div className={styles.spinner}>
          <CircularProgress
            size={60}
            thickness={11}
          />
          <span className={styles.text}>{text}</span>
        </div>
      </div>
      <div className={styles.smallSpin}>
        <CircularProgress
          size={40}
          thickness={8}
        />
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  visible: state.loaderState.visible,
  spin: state.loaderState.spin,
  text: state.loaderState.text
})

export default connect(mapStateToProps)(Loader)
