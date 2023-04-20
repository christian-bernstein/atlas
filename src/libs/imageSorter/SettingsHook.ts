import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";

export function useSettings<T = any>(key: string, def: T | undefined = undefined) {
    return useLiveQuery(() => {
        return isaDB.settings.get(key)
            .then(val => val?.value)
            .then(val => val === undefined ? def : JSON.parse(val!) as T)
    });
}
