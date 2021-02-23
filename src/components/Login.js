import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../utils/refreshToken'
import { CLIENT_ID, SCOPES } from '../utils/googleCredentials'
import Dexie from 'dexie'
import { ApiManager } from '../utils/apiManager'

class Login extends Component {
    
    connectIndexedDB = async() => {
        var db = new Dexie("flockdev07@gmail");
        db.version(1).stores({
            labels: 'id',
            threads: 'id, labels',
            messages: 'id',
        })
        await db.open();
        return db;
    }

    serachDB = async (dbName, tableName) => {
        const exist = await Dexie.exists(dbName);
        if(exist){
            const db = await new Dexie(dbName).open();
            if(db.table(tableName)) {
                const details = await db.table(tableName).toArray()
                return (details && details.length ? details : null);
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }    
    }

    handleResponse = async (response) => {
        if (!response.hasOwnProperty('accessToken')){
            return;
        }
        this.props.setAccessToken(response.tokenObj.access_token);

        const db = await this.connectIndexedDB();
        this.props.setDBInstance(db);

        this.props.setSignedInState({ signedIn: true });

        const apiManager = new ApiManager("me", this.props.accessToken);
        const labelData = await this.serachDB("flockdev07@gmail", "labels");
        if(labelData){
            this.props.setLabels(labelData);
        }
        else{
            apiManager.fetchAPI("labels", "", this.props.accessToken).then((labelJson) => {
                this.props.setLabels(labelJson.labels);
                labelJson.labels.map(value => 
                    db.labels.put({ ...value })
                )
            })
        }

        const threadData = await this.serachDB("flockdev07@gmail", "threads");
        if(threadData){
            this.props.setThreadDetails(threadData);
        }
        else{
            apiManager.fetchAPI("threads", "").then((threadJson) => {
                let threadArray = []
                threadJson.threads.map(value => 
                    apiManager.fetchAPI("threads", value.id).then((threadDetailJson => {
                        threadArray.push(threadDetailJson);
                        this.props.setThreadDetails(threadArray);
                        let unionLabels = [];
                        threadDetailJson.messages.map(value => {
                            unionLabels = [...new Set([...unionLabels, ...value.labelIds])]
                            apiManager.fetchAPI("messages", value.id).then(messageDetailJson => 
                                db.messages.put({ ...messageDetailJson })
                            )
                        })
                        threadDetailJson.labels = unionLabels;
                        db.threads.put({ ...threadDetailJson });
                    }))
                )
            })
        }
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
 