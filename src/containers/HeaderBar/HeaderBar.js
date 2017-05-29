import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar'
import MenuItem from 'material-ui/MenuItem'
import Drawer from 'material-ui/Drawer'

class HeaderBar extends Component {

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
        <AppBar
          style={{height: '64px'}}
          onLeftIconButtonTouchTap={() => this.openDrawer()}>
          {this.props.children}
        </AppBar>
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

export default HeaderBar
