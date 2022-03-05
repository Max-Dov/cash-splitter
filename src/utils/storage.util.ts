import {pathExists, readJson, writeJson} from 'fs-extra';

import {JsonStorage} from '../models/json-storage.model';
import {JSON_STORAGE_INIT} from '../constants/json-storage-init.const';

/**
 * Provides static methods to access JSON storage.
 * TODO think of better (safer I guess) storage communication implementation.
 */
export class Storage {
    static storage: JsonStorage;

    /**
     * Loads storage file into Storage. Expected to be called only once in the app.
     * @param filePath - file path containing JSON storage
     */
    static loadStorage = (filePath: string): Promise<void> =>
        pathExists(filePath)
            .then(exists => exists
                ? readJson(filePath)
                : writeJson(filePath, JSON_STORAGE_INIT).then(() => readJson(filePath)))
            .then((storage: JsonStorage) => {
                Storage.storage = storage;
            });
}