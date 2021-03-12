import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../utils/refreshToken'
import { CLIENT_ID, SCOPES } from '../utils/googleCredentials'
import { setUpDB, serachDB } from '../utils/dbManager'
import { connect } from "react-redux";
import { setAccessToken, setUserSignedIn } from "../actions/index";
import { FetchData } from '../utils/fetchData'
import { beginSync } from "../utils/startStopSync";

function mapDispatchToProps(dispatch) {
    return {
      setAccessToken: accessToken => dispatch(setAccessToken(accessToken)),
      setUserSignedIn: signedIn => dispatch(setUserSignedIn(signedIn)),
    };
  }

  
class Login extends Component {

    handleLogin = async (response) => {
        if (!response.hasOwnProperty('accessToken')){
            return;
        }
        this.props.setAccessToken(response.tokenObj.access_token);
        const db = await setUpDB();
        const fetchData = new FetchData(db);
        await fetchData.fetchUserProfile();
        await fetchData.fetchLabelsAndThreads();
        beginSync();
        this.props.setUserSignedIn(true);
        refreshTokenSetup(response);
    }

    render(){
        return(
        <div>
            <GoogleLogin 
                clientId={CLIENT_ID} 
                scope={SCOPES} 
                onSuccess={this.handleLogin}
                isSignedIn={true}
            />
        </div>
        )
    }

}

export default connect(
    null,
    mapDispatchToProps
  )(Login);