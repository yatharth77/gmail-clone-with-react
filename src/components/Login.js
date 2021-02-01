import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../utils/refreshToken'
import { CLIENT_ID, SCOPES } from '../utils/googleCredentials'

class Login extends Component {
    
    constructor(props){
        super(props);
    }

    getLabels = (callback) => {
        var request = new XMLHttpRequest()
        request.open('GET', 'https://gmail.googleapis.com/gmail/v1/users/me/labels');
        request.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
        request.onload = function (res) {
            callback(res.currentTarget.response);
        }
        request.send()
    }

    setLabels = (labels) => {
        this.props.setLabels(labels);
    }
    
    getInbox = (getMsgCallback, setMsgCallback) => {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://gmail.googleapis.com/gmail/v1/users/me/messages');
        request.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
        request.onload = function (res) {
            const messagesJson = JSON.parse(res.currentTarget.response);
            const messagesArray = messagesJson.messages;
            getMsgCallback(messagesArray, setMsgCallback);
        }
        request.send()
    }

    getMessages = (messagesArray, setMsgCallback) => {
        for(let i = 0; i < messagesArray.length; i++){
            var request = new XMLHttpRequest()
            request.open('GET', "https://gmail.googleapis.com/gmail/v1/users/me/messages/"+messagesArray[i]["id"]);
            request.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
            request.onload = function (res) {
                const msgDetails = res.currentTarget.response;
                setMsgCallback(msgDetails);
            }
            request.send()
        }
    }

    setMessages = (messageDetail) => {
        messageDetail = JSON.parse(messageDetail);
        console.log(messageDetail["snippet"]);
        this.props.setMessages(messageDetail["snippet"]);
    }

    handleResponse = (response) => {
        if (!response.hasOwnProperty('accessToken')){
            return;
        }
        this.props.setAccessToken(response.tokenObj.access_token);
        this.props.setSignedInState({ signedIn: true });
        this.getLabels(this.setLabels);
        this.getInbox(this.getMessages, this.setMessages);
        refreshTokenSetup(response);
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
 