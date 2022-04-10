import {pathExists, readJson, writeJson} from 'fs-extra';

import {JsonStorage} from '@models';
import {JSON_STORAGE_INIT} from '@constants';
import {Logger} from '@utils';

/**
 * Provides static methods to access JSON storage.
 * TODO think of better (safer I guess) storage communication implementation.
 */
export class Storage {
    static storage: JsonStorage;

    /**
     * Loads storage file into Storage. Expected to be called only once in the app.
     */
    static loadStorage = (): Promise<void> => {
        const filePath = process.env.STORAGE_DIR || './build/storage.json';
        return pathExists(filePath)
            .then(exists => exists
                ? readJson(filePath)
                : writeJson(filePath, JSON_STORAGE_INIT, {spaces: 2}).then(() => readJson(filePath)))
            .then((storage: JsonStorage) => {
                Storage.storage = storage;
            });
    };


    static saveStorage = (): Promise<void> => {
        const filePath = process.env.STORAGE_DIR || './build/storage.json';
        const promise = writeJson(filePath, Storage.storage, {spaces: 2});
        promise.then(() => Logger.info('Storage saved'));
        return promise;
    };
}