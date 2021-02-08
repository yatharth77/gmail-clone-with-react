import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../utils/refreshToken'
import { CLIENT_ID, SCOPES } from '../utils/googleCredentials'
import Dexie from 'dexie'

class Login extends Component {
    
    constructor(props){
        super(props);
        var db = new Dexie("flockdev07@gmail");
        db.version(1).stores({
            labels: 'id',
            threads: 'id'
        })
        this.state = {
            dbInstance: db,
        }
    }

    // Setting labels
    fetchLabelsIndexedDB = (fetchLabelAPI, setLabels, dbInstance) => {
        Dexie.exists("flockdev07@gmail").then(function(exists) {
            if (exists){
                new Dexie("flockdev07@gmail").open().then(function(db){
                    if(db.table("labels")) {
                            const table_info = db.table("labels").toArray().then(function(details){
                            setLabels(details);
                        });

                    }
                    else{
                        fetchLabelAPI(setLabels, dbInstance)
                    }
                })
            }
            else{
                fetchLabelAPI(setLabels, dbInstance)
            }
        })
    }


    fetchLabelAPI = (setLabels, dbInstance) => {
        var request = new XMLHttpRequest()
        request.open('GET', 'https://gmail.googleapis.com/gmail/v1/users/me/labels');
        request.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
        request.onload = function (res) {
            const labelString = res.currentTarget.response;
            const labelJson = JSON.parse(labelString);
            setLabels(labelJson.labels);
            labelJson.labels.map((value, index) => {
                dbInstance.labels.put({ ...value })
            })
        }
        request.send()
    }

    setLabels = (labels) => {
        this.props.setLabels(labels);
    }

    // Setting threads
    fetchMailsIndexedDB = (fetchThreadAPI, fetchThreadDetailsAPI, setThread, dbInstance) => {
        Dexie.exists("flockdev07@gmail").then(function(exists) {
            if (exists){
                new Dexie("flockdev07@gmail").open().then(function(db){
                    if(db.table("threads")) {
                                const table_info = db.table("threads").toArray().then(function(details){
                                    details.map((value, index) => {
                                        setThread(value);
                                    })
                                });

                    }
                    else{
                        fetchThreadAPI(fetchThreadDetailsAPI, setThread, dbInstance)
                    }
                })
            }
            else{
                fetchThreadAPI(fetchThreadDetailsAPI, setThread, dbInstance)
            }
        })
    }

    fetchThreadAPI = (fetchThreadDetailsAPI, setThread, dbInstance) => {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://gmail.googleapis.com/gmail/v1/users/me/threads');
        request.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
        request.onload = function (res) {
            const threadJson = JSON.parse(res.currentTarget.response);
            const threadArray = threadJson.threads;
            fetchThreadDetailsAPI(threadArray, setThread, dbInstance);
        }
        request.send()
    }

    fetchThreadDetailsAPI = (threadArray, setThread, dbInstance) => {
        for(let i = 0; i < threadArray.length; i++){
            var request = new XMLHttpRequest()
            request.open('GET', "https://gmail.googleapis.com/gmail/v1/users/me/threads/"+threadArray[i]["id"]);
            request.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
            request.onload = function (res) {
                const threadDetailsString = res.currentTarget.response;
                const threadDetailsJson = JSON.parse(threadDetailsString);
                setThread(threadDetailsJson);
                dbInstance.threads.put({ ...threadDetailsJson })
            }
            request.send()
        }
    }

    setThread = (threadDetails) => {
        this.props.setThreadDetails(threadDetails);
    }


    handleResponse = (response) => {
        if (!response.hasOwnProperty('accessToken')){
            return;
        }
        this.props.setAccessToken(response.tokenObj.access_token);
        this.props.setSignedInState({ signedIn: true });
        this.fetchLabelsIndexedDB(this.fetchLabelAPI, 
            this.setLabels, 
            this.state.dbInstance)
        this.fetchMailsIndexedDB(this.fetchThreadAPI, 
            this.fetchThreadDetailsAPI, 
            this.setThread, 
            this.state.dbInstance)
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
 