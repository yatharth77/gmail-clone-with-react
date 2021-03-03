import React from 'react'
import { Component } from 'react';
import { db } from '../utils/dbManager';

class PartialSync extends Component {
    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 10000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    syncMessageLabels = () => {
        var data = `startHistoryId=${this.props.historyId}&historyTypes=labelRemoved`;
        var xhr = new XMLHttpRequest()
        xhr.open('GET', `https://gmail.googleapis.com/gmail/v1/users/me/history/?${data}`);
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.props.accessToken);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                const responseJson = JSON.parse(xhr.responseText).history;
                if(!responseJson) return;
                responseJson.forEach(thread => {
                    var threadId = null;
                    var unionLabels = [];
                    const labelsRemovedJson = thread.labelsRemoved;
                    labelsRemovedJson.forEach(message => {
                        threadId = message.message.threadId;
                        const messageId = message.message.id;
                        db.messages.update(messageId, {...{labelIds: message.message.labelIds}});
                        unionLabels = [...new Set([...unionLabels, ...message.message.labelIds])];
                    })  
                    db.threads.update(threadId, {...{labels: unionLabels}});
                });

            } else {
                const error = xhr.statusText || 'The reason is mysterious. Call Yoda!';
                console.log(error);
            }
        };
        xhr.send();
    }

    render() {
        return (
            // <button onClick={() => this.syncMessageLabels()}>Click here to sync message-labels</button>
            <div>{this.syncMessageLabels()}</div>
        )
    }
}

export default PartialSync;