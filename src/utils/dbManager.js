import Dexie from 'dexie'

let dbM;
class dbManager {
    constructor(){
        var dbInstance = new Dexie("flockdev07@gmail.com");
        dbInstance.version(1).stores({
            labels: 'id',
            threads: 'id, labels',
            messages: 'id',
            profile: 'key',
        }) 
        return dbInstance;
    }
}

export async function setUpDB() {
    dbM = new dbManager();
    await dbM.open();
    return dbM;
}

export function getDB() {
    return dbM;
}

export function clearDB() {
    dbM.delete();
}

export async function serachDB(dbName, tableName) {
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