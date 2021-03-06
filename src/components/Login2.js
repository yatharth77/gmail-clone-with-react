import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../utils/refreshToken'
import { CLIENT_ID, SCOPES } from '../utils/googleCredentials'
import Dexie from 'dexie'
import { ApiManager } from '../utils/apiManager'
import { db } from '../utils/dbManager'
import { connect } from "react-redux";
import { setAccessToken, setUserSignedIn, setHistoryId } from "../actions/index";
import store from "../store/index"

function mapDispatchToProps(dispatch) {
    return {
      setAccessToken: accessToken => dispatch(setAccessToken(accessToken)),
      setUserSignedIn: signedIn => dispatch(setUserSignedIn(signedIn)),
      setHistoryId: historyId => dispatch(setHistoryId(historyId)),
    };
  }

  
class Login2 extends Component {

    serachDB = async (dbName, tableName) => {
        const exist = await Dexie.exists(dbName);
        if(exist){
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
        const accessToken = store.getState().accessToken;
        const apiManager = new ApiManager("me", accessToken);

        apiManager.fetchAPI("profile", "", accessToken).then((profileJson) => {
            for (var info in profileJson){
                if(info === "historyId"){
                    this.props.setHistoryId(profileJson[info]);
                }
            }
        })
        
        const labelData = await this.serachDB("flockdev07@gmail.com", "labels");
        if(!labelData){
            apiManager.fetchAPI("labels", "", accessToken).then((labelJson) => {
                labelJson.labels.map(value => 
                    db.labels.put({ ...value })
                )
            })
        }

        const threadData = await this.serachDB("flockdev07@gmail.com", "threads");
        if(!threadData){
            apiManager.fetchAPI("threads", "").then((threadJson) => {
                let threadArray = []
                threadJson.threads.map(value => 
                    apiManager.fetchAPI("threads", value.id).then((threadDetailJson => {
                        threadArray.push(threadDetailJson);
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
        this.props.setUserSignedIn(true);
        refreshTokenSetup(response);
    }

    render(){
        return(
        <div>
            <GoogleLogin 
                clientId={CLIENT_ID} 
                scope={SCOPES} 
                onSuccess={this.handleResponse}
                isSignedIn={true}
            />
        </div>
        )
    }

}

export default connect(
    null,
    mapDispatchToProps
  )(Login2);