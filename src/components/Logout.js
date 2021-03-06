import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login'
import { setAccessToken, setUserSignedIn, setHistoryId, setLabel } from "../actions/index";
import { CLIENT_ID } from '../utils/googleCredentials'
import { connect } from "react-redux";

function mapDispatchToProps(dispatch) {
    return {
      setAccessToken: accessToken => dispatch(setAccessToken(accessToken)),
      setUserSignedIn: signedIn => dispatch(setUserSignedIn(signedIn)),
      setHistoryId: historyId => dispatch(setHistoryId(historyId)),
      setLabel: label => dispatch(setLabel(label)),
    };
  }

class Logout extends Component {
    handleResponse = () => {
        this.props.setAccessToken("");
        this.props.setUserSignedIn(false);
        this.props.setHistoryId("");
        this.props.setLabel("INBOX");
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
 