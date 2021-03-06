import React, { Component, useEffect, useState } from 'react'
import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../utils/dbManager'
import PartialSync from './PartialSync'
import { setLabel } from "../actions/index";
import { connect } from "react-redux";

function mapDispatchToProps(dispatch) {
    return {
      setLabel: label => dispatch(setLabel(label)),
    };
  }


function Sidebar(props) {
    const addNewLabel = () => {
        db.labels.add({
            "id": "TESTING_LABEL" + Date.now(), 
            "name": "TESTING_LABEL" + Date.now(), 
            "messageListVisibility": "hide",
            "labelListVisibility": "labelHide", 
            "type": "system"
        })
    }

    const labelArray = useLiveQuery (
        () => db.labels.toArray()
    );
    if(!labelArray) return null;
    
    const handleLabel = async (labelName) => {
        labelName = labelName.toUpperCase();
        props.setLabel(labelName);
    }

    return (
        <div>
            <ul className="list-unstyled components">
                <p>Labels</p>
                {
                    labelArray.map((value, index) => {
                        return <li onClick={() => handleLabel(value.name)} key={index}><a>{value.name}</a></li>
                    })
                }
            </ul>
            {/* <button onClick={() => addNewLabel()}>Add Labels</button> */}
            <PartialSync />
        </div>
    )
}


export default connect(
    null,
    mapDispatchToProps
  )(Sidebar);