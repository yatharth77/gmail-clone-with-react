import { ApiManager } from './apiManager'
import { setUpDB, serachDB } from './dbManager'

export class FetchData{
    constructor(db){
        this.apiManager = new ApiManager("me");
        this.db = db;
    }

    fetchUserProfile = async () => {
        this.apiManager.fetchAPI("profile", "").then((profileJson) => {
            for(var key in profileJson){
                this.db.profile.put({ ... {key: key, value: profileJson[key]} });
            }
        })
    }

    fetchLabels = async () => {
        const labelData = await serachDB("flockdev07@gmail.com", "labels");
        if(!labelData){
            this.apiManager.fetchAPI("labels", "").then((labelJson) => {
                labelJson.labels.map(value => 
                    this.db.labels.put({ ...value })
                )
            })
        }
    }

    fetchThreads = async () => {
        const threadData = await serachDB("flockdev07@gmail.com", "threads");
        if(!threadData){
            this.apiManager.fetchAPI("threads", "").then((threadJson) => {
                let threadArray = []
                threadJson.threads.map(value => 
                    this.apiManager.fetchAPI("threads", value.id).then((threadDetailJson => {
                        threadArray.push(threadDetailJson);
                        let unionLabels = [];
                        threadDetailJson.messages.map(value => {
                            unionLabels = [...new Set([...unionLabels, ...value.labelIds])]
                            this.apiManager.fetchAPI("messages", value.id).then(messageDetailJson => 
                                this.db.messages.put({ ...messageDetailJson })
                            )
                        })
                        threadDetailJson.labels = unionLabels;
                        this.db.threads.put({ ...threadDetailJson });
                    }))
                )
            })
        }
    }

    fetchLabelsAndThreads = async () => {
        this.fetchLabels();
        this.fetchThreads();
    }
}