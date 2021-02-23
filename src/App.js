import React, { Component } from 'react'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import LoadMessages from './components/LoadMessages'
// import Logout from './components/Logout'
import './App.css'
import TestingLiveQuery from './components/testingLiveQuery'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        signedIn: false,
        accessToken: "",
        labels: [],
        threadDetails: [],
    }
  }

  signOut = () => {
    this.setState({ signedIn: false});
  }

  signIn = () => {
    this.setState({ signedIn: true});
  }

  setAccessToken = (access_token) => {
    this.setState({ accessToken: access_token });
  }

  setLabels = (labels) => {
    this.setState({ labels: labels });
  }

  setThreadDetails = (threadDetails) => {
    this.setState({ threadDetails: threadDetails });
  }

  render(){
      return(
        <div>
          <div className="wrapper">
              <nav id="sidebar">
                <div className="sidebar-header">
                  <h3>Welcome to Gmail clone</h3>
                  <Login 
                    setSignedInState={this.signIn} 
                    accessToken={this.state.accessToken}
                    setAccessToken={this.setAccessToken}
                    setLabels={this.setLabels}
                    setThreadDetails={this.setThreadDetails}
                  />
                  { this.state.signedIn 
                    ? <Sidebar 
                        signedInState={this.state.signedIn} 
                        accessToken={this.state.accessToken}
                        labels={this.state.labels}
                        setThreadDetails={this.setThreadDetails}
                      />
                    : null
                  }
                </div>
              </nav>

            <div className="login-div">
              { this.state.signedIn 
                ? <h1>Welcome, you are signed 
                    <hr/> 
                    <LoadMessages threadDetails={this.state.threadDetails}/>
                    {/* <TestingLiveQuery
                      labels={this.state.labels}
                      setLabels={this.setLabels}
                    /> */}
                  </h1>
                : <h1>Click to Signin</h1>
              }

            </div>
            {/* <Logout setSignedInState={this.signOut} /> */}
          </div>
        </div>
      )
  }

}

export default App;
 