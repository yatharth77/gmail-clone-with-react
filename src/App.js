import React, { Component } from 'react'
import Login from './components/Login'
import Logout from './components/Logout'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        signedIn: false,
    }
  }

  signOut = () => {
    this.setState({ signedIn: false});
  }

  signIn = () => {
    this.setState({ signedIn: true});
  }

  render(){
      return(
        <div>
          { this.state.signedIn ? "Welcome, you are signed in" : "Click to Signin" }
          <Login setSignedInState={this.signIn} />
          <Logout setSignedInState={this.signOut} />
        </div>
      )
  }

}

export default App;
 