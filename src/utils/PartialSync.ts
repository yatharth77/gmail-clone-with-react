import { ApiManager } from './apiManager'
import { PARTIAL_SYNC_TIME } from './constant'
import { Labels, Threads, Messages } from './dbManager'
export class PartialSync {
    db: any;
    interval: any;

    setDB = (db: any) => {
        this.db = db;
    }

    handleLabelsRemoved = (labelsRemovedJson: IThreadlabelModified[]) => {
        labelsRemovedJson.forEach((message: any) => {
            const threadId: string = message.message.threadId;
            const messageId: string = message.message.id;
            const labelIds: string[] = message.message.labelIds;
            this.db.messages.update(messageId, {...{labelIds: labelIds}});
            this.db.threads.where('id').equals(threadId).modify((thread: Threads) => {
                const allMsg = thread.messages;
                let unionLabels: string[] = [];
                for(message in allMsg){
                    if(allMsg[message].id == messageId) {
                        allMsg[message].labelIds = labelIds;
                    }
                    unionLabels = Array.from(new Set([...unionLabels, ...allMsg[message].labelIds]))
                }
                thread.messages = allMsg;
                thread.labels = unionLabels;
            })
        })  
    }

    handleLabelsAdded = (labelsAddedJson: IThreadlabelModified[]) => {
        labelsAddedJson.forEach((message: any) => {
            const threadId: string = message.message.threadId;
            const messageId: string = message.message.id;
            const labelIds : string[] = message.message.labelIds
            this.db.messages.update(messageId, {...{labelIds: labelIds}});
            this.db.threads.where('id').equals(threadId).modify((thread: Threads) => {
                const allMsg = thread.messages;
                let unionLabels: string[] = [];
                for(message in allMsg){
                    if(allMsg[message].id == messageId) {
                        allMsg[message].labelIds = labelIds;
                    }
                    unionLabels = Array.from(new Set([...unionLabels, ...allMsg[message].labelIds]))
                }
                thread.messages = allMsg;
                thread.labels = unionLabels;
                return thread;
            })
        })  
    }

    handleMessagesAdded = async (messagesAddedJson: IMesaageAction[], apiManager: any) => {
        messagesAddedJson.forEach(async (message: any) => {
            const threadId: string = message.message.threadId;
            const messageId: string = message.message.id;
            apiManager.fetchAPI("messages", messageId).then(async (messageDetailJson: Messages) => {
                this.db.messages.put({ ...messageDetailJson })
                const threadExist = await this.db.threads.get(threadId);
                if(threadExist){
                    this.db.threads.where('id').equals(threadId).modify((thread: Threads) => {
                        thread.labels.concat(messageDetailJson.labelIds);
                        thread.messages.push(messageDetailJson)
                        return thread;
                    })
                }
                else{
                    apiManager.fetchAPI("threads", threadId).then(((threadDetailJson: Threads) => {
                        threadDetailJson.labels = messageDetailJson.labelIds;
                        this.db.threads.put({ ...threadDetailJson });
                    }))
                }
            })
        })
    }

    handleMessagesDeleted = (messagesDeletedJson: IMesaageAction[]) => {
        messagesDeletedJson.forEach((message: any) => {
            const threadId: string = message.message.threadId;
            const messageId: string = message.message.id;
            this.db.messages.delete(messageId);
            this.db.threads.where('id').equals(threadId).modify((thread: Threads) => {
                const allMsg = thread.messages;
                let unionLabels: string[] = [];
                for(message in allMsg) {
                    if(allMsg[message].id === messageId)
                        allMsg.splice(message, 1);
                    else
                        unionLabels = Array.from(new Set([...unionLabels, ...allMsg[message].labelIds]))
                }
                thread.messages = allMsg;
                thread.labels = unionLabels;
                return thread;
            });
        })
    }

    syncMessageLabels = async () => {
        const historyIdObject: any = await this.db.profile.get("historyId");
        const historyId: string = historyIdObject.value;
        var data: string = `startHistoryId=${historyId}&historyTypes=labelRemoved&historyTypes=labelAdded&historyTypes=messageAdded&historyTypes=messageDeleted`;
        const apiManager = new ApiManager("me");
        apiManager.fetchAPI("history", "", data).then((responseJson: any) => {
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
                if(messagesDeletedJson) this.handleMessagesDeleted(messagesDeletedJson)
            }
            this.db.profile.update('historyId', { ...{value: responseJson.historyId}});
        })

        apiManager.fetchAPI("labels").then((labelJson: any) => {
            labelJson.labels.map((value: Labels) => 
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

export interface IMesaageAction {
    id: string, 
    labelIds: string[], 
    threadId: string
}

export interface IThreadlabelModified {
    labelIds: string[], 
    message: IMesaageAction[]
}
