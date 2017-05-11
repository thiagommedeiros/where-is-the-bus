import React, { Component } from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import MenuItem from 'material-ui/MenuItem'
import Drawer from 'material-ui/Drawer'

import styles from './Menu.css'

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDrawer: false
    }
  }

  openDrawer (action) {
    this.setState({
      openDrawer: action || !this.state.openDrawer
    })
  }

  classNames (el) {
    switch (el) {
      case 'refreshButton':
        return [
          styles.refreshButton,
          // !this.props.mapState.markers.length ? styles.hidden : ''
        ].join(' ')

      default:
    }
  }

  render () {
    return (
      <div>
        <FloatingActionButton
          mini={true}
          className={styles.menuButton}
          onTouchTap={() => this.openDrawer() }>
          <MenuIcon />
        </FloatingActionButton>
        <Drawer
          open={this.state.openDrawer}
          docked={false}
          onRequestChange={action => this.openDrawer(action)}>
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
        <FloatingActionButton
          mini={true}
          className={this.classNames('refreshButton')}
          backgroundColor='#ccc'
          onTouchTap={() => {}}>
          <RefreshIcon />
        </FloatingActionButton>
      </div>
    )
  }
}

export default Menu
