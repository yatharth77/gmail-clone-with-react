import React, { Component, useEffect, useState } from 'react'
import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../utils/dbManager'
import PartialSync from './PartialSync'
import { setActiveLabel } from "../actions/index";
import { connect } from "react-redux";
import Logout from './Logout';

function mapDispatchToProps(dispatch) {
    return {
      setActiveLabel: activeLabel => dispatch(setActiveLabel(activeLabel)),
    };
  }


function Sidebar(props) {

    const labelArray = useLiveQuery (
        () => db.labels.toArray()
    );
    if(!labelArray) return null;
    
    const handleLabel = async (activeLabel) => {
        activeLabel = activeLabel.toUpperCase();
        props.setActiveLabel(activeLabel);
    }

    return (
        <div>
            {<Logout />}
            <ul className="list-unstyled components">
                <p>Labels</p>
                {
                    labelArray.map((value, index) => {
                        return <li onClick={() => handleLabel(value.name)} key={index}><a>{value.name}</a></li>
                    })
                }
            </ul>
            <PartialSync />
        </div>
    )
}


export default connect(
    null,
    mapDispatchToProps
  )(Sidebar);