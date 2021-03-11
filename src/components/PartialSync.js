import React from 'react'
import { Component } from 'react';
import { db } from '../utils/dbManager';
import { connect } from "react-redux";
import { setHistoryId } from "../actions/index";
import store from "../store/index"
import { ApiManager } from '../utils/apiManager'

function mapDispatchToProps(dispatch) {
    return {
      setHistoryId: historyId => dispatch(setHistoryId(historyId)),
    };
  }


class PartialSync extends Component {
    constructor() {
        super();
        this.state = {
            apiManager: null,
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 10000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleLabelsRemoved(labelsRemovedJson) {
        labelsRemovedJson.forEach(message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            const labelIds = message.message.labelIds;
            db.messages.update(messageId, {...{labelIds: labelIds}});
            db.threads.where('id').equals(threadId).modify(thread => {
                const allMsg = thread.messages;
                let unionLabels = [];
                for(message in allMsg){
                    if(allMsg[message].id == messageId) {
                        allMsg[message].labelIds = labelIds;
                    }
                    unionLabels = [...new Set([...unionLabels, ...allMsg[message].labelIds])]
                }
                thread.messages = allMsg;
                thread.labels = unionLabels;
            })
        })  
    }

    handleLabelsAdded(labelsAddedJson) {
        labelsAddedJson.forEach(message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            const labelIds = message.message.labelIds
            db.messages.update(messageId, {...{labelIds: labelIds}});
            db.threads.where('id').equals(threadId).modify(thread => {
                const allMsg = thread.messages;
                let unionLabels = [];
                for(message in allMsg){
                    if(allMsg[message].id == messageId) {
                        allMsg[message].labelIds = labelIds;
                    }
                    unionLabels = [...new Set([...unionLabels, ...allMsg[message].labelIds])]
                }
                thread.messages = allMsg;
                thread.labels = unionLabels;
                return thread;
            })
        })  
    }

    async handleMessagesAdded(messagesAddedJson, apiManager) {
        messagesAddedJson.forEach(message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            apiManager.fetchAPI("messages", messageId).then(messageDetailJson => {
                db.messages.put({ ...messageDetailJson })
                db.threads.where('id').equals(threadId).modify(thread => {
                    thread.labels.concat(messageDetailJson.labelIds);
                    thread.messages.push(messageDetailJson)
                    return thread;
                })
            })
        })
    }

    handleMessagesDeleted(messageDeleted, thread) {
        messageDeleted.forEach(message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            db.messages.delete(messageId);
            db.threads.where('id').equals(threadId).modify(thread = () =>{
                const allMsg = thread.messages;
                let unionLabels = [];
                for(message in allMsg) {
                    if(allMsg[message].id === messageId)
                        allMsg.splice(message, 1);
                    else
                        unionLabels = [...new Set([...unionLabels, ...allMsg[message].labelIds])]
                }
                thread.messages = allMsg;
                thread.labels = unionLabels;
                return thread;
            });
        })
    }

    syncMessageLabels = () => {
        const historyId = store.getState().historyId;
        var data = `startHistoryId=${historyId}&historyTypes=labelRemoved&historyTypes=labelAdded&historyTypes=messageAdded&historyTypes=messageDeleted`;
        const apiManager = new ApiManager("me");
        apiManager.fetchAPI("history", "", data).then((responseJson) => {
            const responseHistoryJson = responseJson.history;
            if(!responseHistoryJson) return;
            responseHistoryJson.forEach(thread => {
                console.log(thread);
                if(!thread.labelsRemoved && !thread.labelsAdded && !thread.messagesAdded && !thread.messagesRemoved){
                    return;
                }
                const labelsRemovedJson = thread.labelsRemoved;
                if(labelsRemovedJson) this.handleLabelsRemoved(labelsRemovedJson);

                const labelsAddedJson = thread.labelsAdded;
                if(labelsAddedJson) this.handleLabelsAdded(labelsAddedJson);

                const messagesAddedJson = thread.messagesAdded;
                if(messagesAddedJson) this.handleMessagesAdded(messagesAddedJson, apiManager);

                const messagesDeleted = thread.messagesDeleted;
                if(messagesDeleted) this.handleMessagesDeleted(messagesDeleted, thread)
            });
            this.props.setHistoryId(responseJson.historyId);
        })
        return;
    }

    render() {
        return (
            <div>{this.syncMessageLabels()}</div>
        )
    }
}

export default connect(
    null,
    mapDispatchToProps
  )(PartialSync);