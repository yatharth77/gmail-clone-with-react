import { ApiManager } from './apiManager'
import { PARTIAL_SYNC_TIME } from './constant'
class PartialSync {
    setDB = (db) => {
        this.db = db;
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

    handleMessagesAdded = async (messagesAddedJson, apiManager) => {
        messagesAddedJson.forEach(async message => {
            const threadId = message.message.threadId;
            const messageId = message.message.id;
            apiManager.fetchAPI("messages", messageId).then(async messageDetailJson => {
                this.db.messages.put({ ...messageDetailJson })
                const threadExist = await this.db.threads.get(threadId);
                if(threadExist){
                    this.db.threads.where('id').equals(threadId).modify(thread => {
                        thread.labels.concat(messageDetailJson.labelIds);
                        thread.messages.push(messageDetailJson)
                        return thread;
                    })
                }
                else{
                    apiManager.fetchAPI("threads", threadId).then((threadDetailJson => {
                        threadDetailJson.labels = messageDetailJson.labelIds;
                        this.db.threads.put({ ...threadDetailJson });
                    }))
                }
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
            const responseHistoryJson = responseJson.history;
            if(!responseHistoryJson) return;
            for(let index in responseHistoryJson){
                const thread = responseHistoryJson[index];
                if(!thread.labelsRemoved && !thread.labelsAdded && !thread.messagesAdded && !thread.messagesDeleted){
                    continue;
                }   
                const labelsRemovedJson = thread.labelsRemoved;
                if(labelsRemovedJson) this.handleLabelsRemoved(labelsRemovedJson);

                const labelsAddedJson = thread.labelsAdded;
                if(labelsAddedJson) this.handleLabelsAdded(labelsAddedJson);

                const messagesAddedJson = thread.messagesAdded;
                if(messagesAddedJson) this.handleMessagesAdded(messagesAddedJson, apiManager);

                const messagesDeletedJson = thread.messagesDeleted;
                if(messagesDeletedJson) this.handleMessagesDeleted(messagesDeletedJson, thread)
            }
            this.db.profile.update('historyId', { ...{value: responseJson.historyId}});
        })

        apiManager.fetchAPI("labels", "").then((labelJson) => {
            labelJson.labels.map(value => 
                this.db.labels.put({ ...value })
            )
        })
    }

    syncData = () => {
        this.interval = setInterval(this.syncMessageLabels, PARTIAL_SYNC_TIME);
    }

    stopSync = () => {
        clearInterval(this.interval);
    }
}

export default new PartialSync;