import React, { Component } from 'react'
import parse from 'html-react-parser';
import '../style/style.css'
import { useLiveQuery } from "dexie-react-hooks";
import store from "../store/index"
import { db } from '../utils/dbManager'

function LoadMessages() {
    const label = store.getState().label;
    const threadResult = useLiveQuery(
        () => db.threads.filter(thread => thread.labels.includes(label)).toArray(),
        [label]
    );
    
    if(!threadResult) return null;

    return(
        <div className="list-group">
            {
                threadResult.map((thread, threadIndex) => {
                    const messages = thread.messages;
                    return (
                        <div key={threadIndex}>
                            <a href="#" className="list-group-header">Message Thread {threadIndex+1}</a> 
                            <div className="list-group">
                            {
                                messages.map((message, messageIndex) => {
                                    return (<a href="#" className="list-group-item" key={messageIndex}><p>Message {messageIndex+1}:</p>{parse(message.snippet)}</a>)
                                })
                            }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )

}

export default LoadMessages;
 