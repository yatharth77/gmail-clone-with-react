import { getDB } from './dbManager';
import { ApiManager } from './apiManager'
import store from '../store';

export class PartialSync {
    constructor() {
        this.db = getDB();
    }

    handleLabelsRemoved = (labelsRemovedJson) => {
        labelsRemovedJson.forEach(message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            const labelIds = message.message.labelIds;
            this.db.messages.update(messageId, {...{labelIds: labelIds}});
            this.db.threads.where('id').equals(threadId).modify(thread => {
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

    handleLabelsAdded = (labelsAddedJson) => {
        labelsAddedJson.forEach(message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            const labelIds = message.message.labelIds
            this.db.messages.update(messageId, {...{labelIds: labelIds}});
            this.db.threads.where('id').equals(threadId).modify(thread => {
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

    handleMessagesAdded = (messagesAddedJson, apiManager) => {
        messagesAddedJson.forEach(message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            apiManager.fetchAPI("messages", messageId).then(messageDetailJson => {
                this.db.messages.put({ ...messageDetailJson })
                this.db.threads.where('id').equals(threadId).modify(thread => {
                    thread.labels.concat(messageDetailJson.labelIds);
                    thread.messages.push(messageDetailJson)
                    return thread;
                })
                // this.db.threads.get(threadId).then(threadExist => {
                //     if(threadExist){
                //         this.db.threads.where('id').equals(threadId).modify(thread => {
                //             thread.labels.concat(messageDetailJson.labelIds);
                //             thread.messages.push(messageDetailJson)
                //             return thread;
                //         })
                //     }
                //     else{
                //         apiManager.fetchAPI("threads", threadId).then(threadDetailJson => {
                //             threadDetailJson.labels = messageDetailJson.labelIds;
                //             this.db.threads.put(threadDetailJson);
                //         })
                //     }
                // });
            })
        })
    }

    handleMessagesDeleted = (messagesDeletedJson, thread) => {
        messagesDeletedJson.forEach(message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            this.db.messages.delete(messageId);
            this.db.threads.where('id').equals(threadId).modify(thread => {
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

    syncMessageLabels = async () => {
        const historyIdObject = await this.db.profile.get("historyId");
        const historyId = historyIdObject.value;
        var data = `startHistoryId=${historyId}&historyTypes=labelRemoved&historyTypes=labelAdded&historyTypes=messageAdded&historyTypes=messageDeleted`;
        const apiManager = new ApiManager("me");
        apiManager.fetchAPI("history", "", data).then((responseJson) => {
            console.log(responseJson);
            const responseHistoryJson = responseJson.history;
            if(!responseHistoryJson) return;
            responseHistoryJson.forEach(thread => {
                if(!thread.labelsRemoved && !thread.labelsAdded && !thread.messagesAdded && !thread.messagesDeleted){
                    return;
                }   
                const labelsRemovedJson = thread.labelsRemoved;
                if(labelsRemovedJson) this.handleLabelsRemoved(labelsRemovedJson);

                const labelsAddedJson = thread.labelsAdded;
                if(labelsAddedJson) this.handleLabelsAdded(labelsAddedJson);

                const messagesAddedJson = thread.messagesAdded;
                if(messagesAddedJson) this.handleMessagesAdded(messagesAddedJson, apiManager);

                const messagesDeletedJson = thread.messagesDeleted;
                if(messagesDeletedJson) this.handleMessagesDeleted(messagesDeletedJson, thread)
            });
            this.db.profile.update('historyId', { ...{value: responseJson.historyId}});
        })
    }

    syncData = () => {
        setInterval(this.syncMessageLabels, 10000);
    }
}