import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../utils/refreshToken'

class Login extends Component {
  handleResponse = (response) => {
    var request = new XMLHttpRequest()
    request.open('GET', 'https://gmail.googleapis.com/gmail/v1/users/me/labels?key=AIzaSyAYZRiPLCH5hDAyIeRbjX7y67SkGfCVIN8', true)
    request.setRequestHeader('Authorization', 'Bearer ' + response.tokenObj.access_token);
    request.onload = function (res) {
      console.log(res);
    }
    request.send()
    refreshTokenSetup(response)
  }
  render(){
      return(
        <div>
          <GoogleLogin 
            clientId={'1025950630557-ir2p4fp2tnkl0co0il6jgee1ikhdd054.apps.googleusercontent.com'} 
            scope={"https://mail.google.com/ https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.readonly"} 
            onSuccess={this.handleResponse}
          />
        </div>
      )
  }

}

export default Login;
 