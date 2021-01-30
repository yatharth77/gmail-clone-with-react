import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login'

class Logout extends Component {
  handleResponse = () => {
    console.log("Logged out successfull")
  }
  render(){
      return(
        <div>
          <GoogleLogout 
            clientId={'1025950630557-ir2p4fp2tnkl0co0il6jgee1ikhdd054.apps.googleusercontent.com'} 
            buttonText={"Logout"}
            onLogoutSuccess={this.handleResponse}
          />
        </div>
      )
  }

}

export default Logout;
 