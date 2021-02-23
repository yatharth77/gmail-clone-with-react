import React, { useState } from "react";
import Dexie, { liveQuery } from "dexie";
import { renderIntoDocument } from "react-dom/test-utils";

function TestingLiveQuery(props) {

    const new_label = {
        "id": "TESTING_LABEL" + Date.now() ,
        "name": "TESTING_LABEL" + Date.now(), 
        "messageListVisibility": "hide",
        "labelListVisibility": "labelHide", 
        "type": "system"
    }
    
    const testQuery = liveQuery (
      () => props.db.labels.filter(label => label.name.includes("TESTING_LABEL")).toArray()
    );
    
    testQuery.subscribe({
      next: result => {
          console.log(result, "testing");
          // props.setLabels(result);
        },
      error: error => console.error(error)
    });
    

    return (
        <div>
            <button onClick={() => props.db.labels.put(new_label)}>Click here to test live query</button>
        </div>
    );
}

 
export default TestingLiveQuery;