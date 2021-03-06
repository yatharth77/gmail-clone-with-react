import React, { useState } from 'react'
import Login2 from './components/Login2'
import Sidebar from './components/Sidebar'
import LoadMessages from './components/LoadMessages'
// import Logout from './components/Logout'
import './App.css'
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { 
    accessToken: state.accessToken,
    signedIn: state.signedIn,
    historyId: state.historyId,
    label: state.label,
  };
};

function App(props) {
  return(
    <div>
      <div className="wrapper">
          <nav id="sidebar">
            <div className="sidebar-header">
              <h3>Welcome to Gmail clone</h3>
              <Login2 />
              { props.signedIn 
                ? 
                <Sidebar />
                : null
              }

            </div>
          </nav>

        <div className="login-div">
          { props.signedIn 
            ? <h1>Welcome, you are signed 
                <hr/> 
                <LoadMessages />
              </h1>
            : <h1>Click to Signin</h1>
          }

        </div>
        {/* <Logout setSignedInState={signOut} /> */}
      </div>
    </div>
  )

}

export default connect(mapStateToProps)(App);;
 