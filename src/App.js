import React, { Component } from 'react'
import Login from './components/Login'
import Logout from './components/Logout'

class App extends Component {
  render(){
      return(
        <div>
          <Login />
          <Logout />
        </div>
      )
  }

}

export default App;
 