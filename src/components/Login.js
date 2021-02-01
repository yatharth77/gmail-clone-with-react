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
    
    getThreads = (getThreadCallback, setThreadCallback) => {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://gmail.googleapis.com/gmail/v1/users/me/threads');
        request.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
        request.onload = function (res) {
            const threadJson = JSON.parse(res.currentTarget.response);
            const threadArray = threadJson.threads;
            getThreadCallback(threadArray, setThreadCallback);
        }
        request.send()
    }

    getThreadDetails = (threadArray, setThreadCallback) => {
        for(let i = 0; i < threadArray.length; i++){
            var request = new XMLHttpRequest()
            request.open('GET', "https://gmail.googleapis.com/gmail/v1/users/me/threads/"+threadArray[i]["id"]);
            request.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
            request.onload = function (res) {
                const threadDetails = res.currentTarget.response;
                setThreadCallback(threadDetails);
            }
            request.send()
        }
    }

    setThreadDetails = (threadDetails) => {
        threadDetails = JSON.parse(threadDetails);
        this.props.setThreadDetails(threadDetails);
    }


    handleResponse = (response) => {
        if (!response.hasOwnProperty('accessToken')){
            return;
        }
        this.props.setAccessToken(response.tokenObj.access_token);
        this.props.setSignedInState({ signedIn: true });
        this.getLabels(this.setLabels);
        this.getThreads(this.getThreadDetails, this.setThreadDetails);
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
 