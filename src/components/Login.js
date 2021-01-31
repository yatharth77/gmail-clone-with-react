import React, { Component, useCallback } from 'react'
import { GoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../utils/refreshToken'
import { CLIENT_ID, SCOPES } from '../utils/googleCredentials'

class Login extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            accessToken: ""
        }
    }

    getLabels = () => {
        var request = new XMLHttpRequest()
        request.open('GET', 'https://gmail.googleapis.com/gmail/v1/users/me/labels');
        request.setRequestHeader('Authorization', 'Bearer ' + this.state.accessToken);
        request.onload = function (res) {
            console.log(res.currentTarget.response);
        }
        request.send()
    }

    getInbox = (callback) => {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://gmail.googleapis.com/gmail/v1/users/me/messages');
        request.setRequestHeader('Authorization', 'Bearer ' + this.state.accessToken);
        request.onload = function (res) {
            const messagesJson = JSON.parse(res.currentTarget.response);
            const messagesArray = messagesJson.messages;
            callback(messagesArray);
        }
        request.send()
    }

    getMessages = (messagesArray) => {
        console.log(messagesArray);
        for(let i = 0; i < messagesArray.length; i++){
            var request = new XMLHttpRequest()
            request.open('GET', "https://gmail.googleapis.com/gmail/v1/users/me/messages/"+messagesArray[i]["id"]);
            request.setRequestHeader('Authorization', 'Bearer ' + this.state.accessToken);
            request.onload = function (res) {
                console.log(res.currentTarget.response);
            }
            request.send()
        }
    }

    handleResponse = (response) => {
        if (!response.hasOwnProperty('accessToken')){
            return;
        }
        this.setState({ accessToken: response.tokenObj.access_token });
        this.props.setSignedInState({ signedIn: true });
        refreshTokenSetup(response)

        this.getInbox(this.getMessages);
    }
  render(){
      return(
        <div>
            <GoogleLogin 
                clientId={CLIENT_ID} 
                scope={SCOPES} 
                onSuccess={this.handleResponse}
            />
        </div>
      )
  }

}

export default Login;
 