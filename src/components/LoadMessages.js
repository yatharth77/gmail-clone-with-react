import React, { Component } from 'react'
import parse from 'html-react-parser';
import '../style/style.css'

class LoadMessages extends Component {
    processThreads = () => {
        const threadDetailsArray = this.props.threadDetails;
        if(!threadDetailsArray) return null;
        return (
            <div className="list-group">
                {
                    threadDetailsArray.map((thread, threadIndex) => {
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

    render(){
        return(
            this.processThreads()
        )
    }

}

export default LoadMessages;
 