import React, { Component } from 'react'
// import Login from './components/Login'
import Login2 from './components/Login2'
// import Sidebar from './components/Sidebar'
// import Sidebar2 from './components/Sidebar2'
import Sidebar from './components/Sidebar'
import LoadMessages from './components/LoadMessages'
// import Logout from './components/Logout'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        signedIn: false,
        accessToken: "",
        labels: [],
        threadDetails: [],
        historyId: "",
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

  setHistoryID = (id) => {
    this.setState({ historyId: id});
  }

  render(){
      return(
        <div>
          <div className="wrapper">
              <nav id="sidebar">
                <div className="sidebar-header">
                  <h3>Welcome to Gmail clone</h3>
                  {/* <Login 
                    setSignedInState={this.signIn} 
                    accessToken={this.state.accessToken}
                    setAccessToken={this.setAccessToken}
                    setLabels={this.setLabels}
                    setThreadDetails={this.setThreadDetails}
                  /> */}
                  <Login2
                    setSignedInState={this.signIn} 
                    accessToken={this.state.accessToken}
                    setAccessToken={this.setAccessToken}
                    setLabels={this.setLabels}
                    setThreadDetails={this.setThreadDetails}
                    historyId={this.state.historyId}
                    setHistoryID={this.setHistoryID}
                  />
                  { this.state.signedIn 
                    ? 
                    <Sidebar 
                        signedInState={this.state.signedIn} 
                        accessToken={this.state.accessToken}
                        labels={this.state.labels}
                        setThreadDetails={this.setThreadDetails}
                        historyId={this.state.historyId}
                    />
                      // <Sidebar2
                      //   labels={this.state.labels}
                      //   setLabels={this.setLabels}
                      //   setThreadDetails={this.setThreadDetails}
                      // />
                    : null
                  }

                </div>
              </nav>

            <div className="login-div">
              { this.state.signedIn 
                ? <h1>Welcome, you are signed 
                    <hr/> 
                    <LoadMessages threadDetails={this.state.threadDetails}/>
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
 