import Dexie from 'dexie'

var dbInstance = new Dexie("flockdev07@gmail.com");
dbInstance.version(1).stores({
    labels: 'id',
    threads: 'id, labels',
    messages: 'id',
    profile: 'key'
})
dbInstance.open();

export const db = dbInstance;