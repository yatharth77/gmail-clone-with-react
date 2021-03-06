import React from 'react'
import { Component } from 'react';
import { db } from '../utils/dbManager';
import { connect } from "react-redux";
import { setHistoryId } from "../actions/index";
import store from "../store/index"

function mapDispatchToProps(dispatch) {
    return {
      setHistoryId: historyId => dispatch(setHistoryId(historyId)),
    };
  }


class PartialSync extends Component {
    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    syncMessageLabels = () => {
        const historyId = store.getState().historyId;
        var data = `startHistoryId=${historyId}&historyTypes=labelRemoved&historyTypes=labelAdded`;
        var xhr = new XMLHttpRequest()
        xhr.open('GET', `https://gmail.googleapis.com/gmail/v1/users/me/history/?${data}`);
        xhr.setRequestHeader('Authorization', 'Bearer ' + store.getState().accessToken);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                const responseJson = JSON.parse(xhr.responseText);
                const responseHistoryJson = responseJson.history;
                if(!responseHistoryJson) return;
                responseHistoryJson.forEach(thread => {
                    var threadId = null;
                    var unionLabels = [];
                    const labelsRemovedJson = thread.labelsRemoved;
                    if(labelsRemovedJson){
                        labelsRemovedJson.forEach(message => {
                            threadId = message.message.threadId;
                            const messageId = message.message.id;
                            db.messages.update(messageId, {...{labelIds: message.message.labelIds}});
                            unionLabels = [...new Set([...unionLabels, ...message.message.labelIds])];
                        })  
                        db.threads.update(threadId, {...{labels: unionLabels}});
                    }

                    threadId = null;
                    unionLabels = [];
                    const labelsAddedJson = thread.labelsAdded;
                    if(labelsAddedJson){
                        labelsAddedJson.forEach(message => {
                            threadId = message.message.threadId;
                            const messageId = message.message.id;
                            db.messages.update(messageId, {...{labelIds: message.message.labelIds}});
                            unionLabels = [...new Set([...unionLabels, ...message.message.labelIds])];
                        })  
                        db.threads.update(threadId, {...{labels: unionLabels}});
                    }
                });
                this.props.setHistoryId(responseJson.historyId);
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

export default connect(
    null,
    mapDispatchToProps
  )(PartialSync);