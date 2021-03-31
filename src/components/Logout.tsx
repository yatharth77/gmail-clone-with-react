import { Component } from 'react'
import { GoogleLogout } from 'react-google-login'
import { setAccessToken, setUserSignedIn, setActiveLabel } from "../actions/index";
import { CLIENT_ID } from '../utils/googleCredentials'
import { connect } from "react-redux";
import { clearDB } from '../utils/dbManager'
import { stopSync } from "../utils/startStopSync";

interface IProps {
  setAccessToken(accessToken: string): any
  setUserSignedIn(signedIn: boolean): any
  setActiveLabel(activeLabel: string): any
}

function mapDispatchToProps(dispatch: any) {
  return {
    setAccessToken: (accessToken: string) => dispatch(setAccessToken(accessToken)),
    setUserSignedIn: (signedIn: boolean) => dispatch(setUserSignedIn(signedIn)),
    setActiveLabel: (activeLabel: string) => dispatch(setActiveLabel(activeLabel)),
  };
}

class Logout extends Component<IProps> {
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
 