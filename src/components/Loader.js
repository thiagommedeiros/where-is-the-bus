import React from 'react'
import { connect } from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'

import styles from './Loader.css'

const spinStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginLeft: '-30px',
  marginTop: '-30px'
}

const Loader = ({ visible }) => {

  const classNames = () => {
    return [
      styles.wrapper,
      !visible ? styles.hidden : ''
    ].join(' ')
  }

  return (
    <div className={classNames()} style={{height: window.innerHeight}}>
      <CircularProgress
        style={spinStyle}
        size={60}
        thickness={11}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  visible: state.loaderState.visible
})

export default connect(mapStateToProps)(Loader)
