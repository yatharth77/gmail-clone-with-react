import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login'
import { setAccessToken, setUserSignedIn, setHistoryId, setActiveLabel } from "../actions/index";
import { CLIENT_ID } from '../utils/googleCredentials'
import { connect } from "react-redux";
import { clearDB } from '../utils/dbManager'
import { stopSync } from "../utils/startStopSync";

function mapDispatchToProps(dispatch) {
    return {
      setAccessToken: accessToken => dispatch(setAccessToken(accessToken)),
      setUserSignedIn: signedIn => dispatch(setUserSignedIn(signedIn)),
      setActiveLabel: activeLabel => dispatch(setActiveLabel(activeLabel)),
    };
  }

class Logout extends Component {
    handleResponse = () => {
        this.props.setAccessToken("");
        this.props.setUserSignedIn(false);
        this.props.setActiveLabel("INBOX");
        stopSync();
        clearDB();
    }
    render(){
        return(
        <div>
            <GoogleLogout 
            clientId={CLIENT_ID} 
            buttonText={"Logout"}
            onLogoutSuccess={this.handleResponse}
            />
        </div>
        )
    }

}

export default connect(
    null,
    mapDispatchToProps
  )(Logout);
 