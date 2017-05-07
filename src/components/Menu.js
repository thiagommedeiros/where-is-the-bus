import React, { Component } from 'react'
import MenuButton from 'material-ui/FloatingActionButton'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import MenuItem from 'material-ui/MenuItem'
import Drawer from 'material-ui/Drawer'

const menuButtonStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: '1'
}

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

  render () {
    return (
      <div>
        <MenuButton
          mini={true}
          style={menuButtonStyle}
          onTouchTap={() => this.openDrawer() }>
          <MenuIcon />
        </MenuButton>
        <Drawer
          open={this.state.openDrawer}
          docked={false}
          onRequestChange={action => this.openDrawer(action)}>
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
      </div>
    )
  }
}

export default Menu
