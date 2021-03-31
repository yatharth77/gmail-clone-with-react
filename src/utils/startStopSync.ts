import { PartialSync } from './PartialSync'
import { getDB } from './dbManager'

export function beginSync() {
    const db = getDB();
    const partialSync = new PartialSync;
    partialSync.setDB(db);
    partialSync.syncData();
}

export function stopSync() {
    const partialSync = new PartialSync;
    partialSync.stopSync();
}