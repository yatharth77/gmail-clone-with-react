import React, { Component, useEffect, useState } from 'react'
import { useLiveQuery } from "dexie-react-hooks";
import Dexie, { liveQuery } from "dexie";
import { db } from '../utils/dbManager'
import PartialSync from './PartialSync'

function Sidebar(props) {
    const [label, setLabel] = useState("INBOX");
    
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
    
    const labelResults = useLiveQuery(
        () => db.threads.filter(thread => thread.labels.includes(label)).toArray(),
        [label]
    );

    if(!labelArray) return null;
    
    const handleLabel = async (labelName) => {
        labelName = labelName.toUpperCase();
        setLabel(labelName);
        props.setThreadDetails(labelResults);
    }

    return (
        <div>
            <ul className="list-unstyled components">
                <p>Labels</p>
                {
                    labelArray.map((value, index) => {
                        return <li onClick={() => handleLabel(value.name)} key={index}><a href="#">{value.name}</a></li>
                    })
                }
            </ul>
            <button onClick={() => addNewLabel()}>Add Labels</button>
            <PartialSync 
                historyId={props.historyId}
                accessToken={props.accessToken}
            />
        </div>
    )
}

export default Sidebar;
 