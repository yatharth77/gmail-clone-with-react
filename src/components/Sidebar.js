import React, { Component, useState } from 'react'
import { useLiveQuery } from "dexie-react-hooks";
import Dexie, { liveQuery } from "dexie";

function Sidebar(props) {
    const [label, setLabel] = useState("INBOX");

    const new_label = {
        "id": "TESTING_LABEL", 
        "name": "TESTING_LABEL", 
        "messageListVisibility": "hide",
        "labelListVisibility": "labelHide", 
        "type": "system"
    }

    const labelResults = useLiveQuery(
        () => props.dbInstance.threads.filter(thread => thread.labels.includes(label)).toArray(),
        [label]
    );
    
    const handleLabel = async (labelName) => {
        labelName = labelName.toUpperCase();
        setLabel(labelName);
        props.setThreadDetails(labelResults);
    }
    
    const addNewLabelInDB = () => {
        props.dbInstance.labels.put({ ...new_label });
    }

    let labelArray = props.labels;
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
            <button onClick={() => addNewLabelInDB()}>Add Labels</button>
        </div>
    )
}

export default Sidebar;
 