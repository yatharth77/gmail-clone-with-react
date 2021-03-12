import partialSync from './PartialSync'
import { getDB } from './dbManager'

export function beginSync() {
    const db = getDB();
    partialSync.setDB(db);
    partialSync.syncData();
}

export function stopSync() {
    partialSync.stopSync();
}