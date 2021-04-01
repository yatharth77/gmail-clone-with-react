import { ApiManager } from './apiManager'
import { serachDB, Labels, Threads, Messages } from './dbManager'
export class FetchData{
    apiManager: any;
    db: any;
    constructor(db: any){
        this.apiManager = new ApiManager("me");
        this.db = db;
    }

    fetchUserProfile = async () => {
        this.apiManager.fetchAPI("profile").then((profileJson: any) => {
            for(var key in profileJson){
                const detail: IProfileDetail = {key: key, value: profileJson[key]}
                this.db.profile.put({ ... detail });
            }
        })
    }

    fetchLabels = async () => {
        const labelData = await serachDB("flockdev07@gmail.com", "labels");
        if(!labelData){
            this.apiManager.fetchAPI("labels").then((labelJson: ILabelJson) => {
                labelJson.labels.map((value: Labels) => 
                    this.db.labels.put({ ...value })
                )
            })
        }
    }

    fetchThreads = async () => {
        const threadData = await serachDB("flockdev07@gmail.com", "threads");
        if(!threadData){
            this.apiManager.fetchAPI("threads", "").then((threadJson: IThreadJson) => {
                let threadArray = []
                threadJson.threads.map((value: IGetThread) => 
                    this.apiManager.fetchAPI("threads", value.id).then(((threadDetailJson: Threads) => {
                        threadArray.push(threadDetailJson);
                        let unionLabels: string[] = [];
                        threadDetailJson.messages.map((value: any) => {
                            unionLabels = Array.from(new Set([...unionLabels, ...value.labelIds]))
                            this.apiManager.fetchAPI("messages", value.id).then((messageDetailJson: Messages) => 
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

export interface IThreadJson {
    resultSizeEstimate: number;
    threads: {historyId: string, id: string, snippet: string, proto?: any}[];   
}

export interface IProfile{
    emailAddress: string
    historyId: string
    messagesTotal: number
    threadsTotal: number
    proto?: any
}

export interface IProfileDetail{
    key: string
    value: any
}


export interface ILabelJson{
    labels: Labels[]
}

export interface IGetThread{
    historyId: string
    id: string
    snippet: string
    proto?: any
}
