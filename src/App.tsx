import React from 'react'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import ThreadList from './components/ThreadList'
import { getDB } from './utils/dbManager'
import './App.css'
import { connect } from "react-redux";

interface Iprops {
  accessToken: string
  signedIn: boolean
  activeLabel: string
  dispatch?: any
}
const mapStateToProps = (state: Iprops) => {
  return { 
    accessToken: state.accessToken,
    signedIn: state.signedIn,
    activeLabel: state.activeLabel,
  };
};

function App(props: Iprops) {
  const db = getDB();
  return(
    <div>
      <div className="wrapper">
          <nav className="sidebar">
            <div className="sidebar-header">
              <h3>Welcome to Gmail clone</h3>
              { props.signedIn 
                ? 
                <div>
                  <Sidebar />
                </div>
                : <Login />
              }
            </div>
          </nav>

        <div className="login-div">
          { props.signedIn 
            ? <h1>Welcome, you are signed 
                <hr className='divider-header'/> 
                <ThreadList />
              </h1>
            : <h1>Click to Signin</h1>
          }

        </div>
      </div>
    </div>
  )

}

export default connect(mapStateToProps)(App);;
 