import Dexie from 'dexie'

let dbM: any;
class dbManager extends Dexie  {
    labels: Dexie.Table<Labels, string>;
    threads: Dexie.Table<Threads, string>; 
    messages: Dexie.Table<Messages, string>; 
    profile: Dexie.Table<Profile, string>; 

    constructor(userEmail: string){
        super(userEmail);
        this.version(1).stores({
            labels: 'id',
            threads: 'id, labels',
            messages: 'id',
            profile: 'key',
        }) 

        this.labels = this.table("labels");
        this.threads = this.table("threads");
        this.messages = this.table("messages");
        this.profile = this.table("profile");
        return this;
    }
}

export async function setUpDB(userEmail: string): Promise<any> {
    dbM = new dbManager(userEmail);
    await dbM.open();
    return dbM;
}

export function getDB(): any {
    return dbM;
}

export function clearDB(): any {
    dbM.delete();
}

export async function serachDB(dbName: string, tableName: string): Promise<any> {
    const exist = await Dexie.exists(dbName);
    if(exist){
        const db = getDB();
        if(db.table(tableName)) {
            const details = await db.table(tableName).toArray()
            return (details && details.length ? details : null);
        }
        else{
            return null;
        }
    }
    else{
        return null;
    }    
}

export interface Labels {
    id: string;
    labelListVisibility: string;
    messageListVisibility: string;
    name: string;
    type: string;
    proto?: any;
}

export interface Threads {
    historyId: string;
    id: string;
    labels: string[];
    messages: Messages[]
}

export interface Messages {
    historyId: string;
    id: string;
    internalDate: string;
    labelIds: string[];
    payload: any;
    sizeEstimate: number;
    snippet: string;
    threadId: string;
}

export interface Profile {
    key: string;
    value: any;   
}