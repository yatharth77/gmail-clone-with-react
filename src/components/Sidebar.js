import React, { Component, useEffect, useState } from 'react'
import { useLiveQuery } from "dexie-react-hooks";
import Dexie, { liveQuery } from "dexie";
import { db } from '../utils/dbManager'
import TestQuery from "./TestQuery";

function Sidebar(props) {
    const [label, setLabel] = useState("INBOX");
    // const [testLabels, setTestLabels] = useState(["test 1", "test 2"]);

    //////////////////////////

    const new_label = {
        "id": "TESTING_LABEL" + Date.now(), 
        "name": "TESTING_LABEL" + Date.now(), 
        "messageListVisibility": "hide",
        "labelListVisibility": "labelHide", 
        "type": "system"
    }

    const testLabels = useLiveQuery (
        () => db.labels.filter(label => label.name.includes("TESTING_LABEL")).toArray()
      );
      
    // testQuery.subscribe({
    // next: result => {
    //     console.log(result, "testing");
    //     setLabel(result);
    // },
    // error: error => console.error(error)
    // });

    //////////////////////////

    const labelResults = useLiveQuery(
        () => db.threads.filter(thread => thread.labels.includes(label)).toArray(),
        [label]
    );
    
    const handleLabel = async (labelName) => {
        labelName = labelName.toUpperCase();
        setLabel(labelName);
        props.setThreadDetails(labelResults);
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
            <button onClick={() => db.labels.put(new_label)}>Add Labels</button>
            <TestQuery testLabels={testLabels} />
        </div>
    )
}

export default Sidebar;
 