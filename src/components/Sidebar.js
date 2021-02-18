import React, { Component, useState } from 'react'
import { useLiveQuery } from "dexie-react-hooks";

function Sidebar(props) {
    const [label, setLabel] = useState("INBOX");
    
    const labelResults = useLiveQuery(
        () => props.dbInstance.threads.filter(thread => thread.labels.includes(label)).toArray(),
        [label]
    );

    const handleLabel = async (labelName) => {
        labelName = labelName.toUpperCase();
        setLabel(labelName);
        props.setThreadDetails(labelResults);
    }
    
    let labelArray = props.labels;
    return (
        <ul className="list-unstyled components">
            <p>Labels</p>
            {
                labelArray.map((value, index) => {
                    return <li onClick={() => handleLabel(value.name)} key={index}><a href="#">{value.name}</a></li>
                })
            }
        </ul>
    )
}

export default Sidebar;
 