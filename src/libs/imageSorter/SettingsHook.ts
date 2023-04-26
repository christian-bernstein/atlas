import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {VFSViewSettings} from "./VFSViewSettings";
import {useContext} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";


export function useSettings<T = any>(key: string, def: T | undefined = undefined) {
    return useLiveQuery(() => {
        return isaDB.settings.get(key)
            .then(val => val?.value)
            .then(val => val === undefined ? def : JSON.parse(val!) as T)
    });
}

export function useAutoSettings<T = any>(key: string, def: T | undefined = undefined, autoInit: boolean = true) {
    const api = useContext(ImageSorterAPIContext);
    return useLiveQuery(() => {
        return isaDB.settings.get(key)
            .then(val => val?.value)
            .then(val => val === undefined ? (() => {
                if (autoInit) api.settingsManager.initSettingsObject<T>(key, def!);
                return def;
            })() : JSON.parse(val!) as T)
    });
}
