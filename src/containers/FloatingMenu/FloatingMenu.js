import React from 'react'
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import MyLocationIcon from 'material-ui/svg-icons/maps/my-location'

import { refreshRoute, centerMap } from '../../utils'
import styles from './FloatingMenu.css'

function FloatingMenu (props) {

  const classNames = () => {
    return [
      props.loader.visible === true && props.loader.spin === 'small' ? styles.hideRefreshButton : '',
      !props.searchState.path ? styles.hideRefreshButton : ''
    ].join(' ')
  }

  return (
    <div className={classNames()}>
      <FloatingActionButton
        className={styles.myLocationButton}
        mini={true}
        backgroundColor="#00BCD4"
        onTouchTap={() => centerMap()}>
        <MyLocationIcon />
      </FloatingActionButton>
      <FloatingActionButton
        className={styles.refreshButton}
        mini={true}
        backgroundColor="#00BCD4"
        onTouchTap={() => refreshRoute()}>
        <RefreshIcon />
      </FloatingActionButton>
    </div>
  )
}

const mapStateToProps = state => ({
  loader: state.loaderState,
  searchState: state.searchBoxState.searchState
})

export default connect(mapStateToProps)(FloatingMenu)
