import {APIShard} from "./APIShard";
import {isaDB} from "./ImageSorterAppDB";
import {VFSViewSettings} from "./VFSViewSettings";
import {StyleLibrarySettings} from "./StyleLibrarySettings";

export class SettingsManager extends APIShard {

    constructor() {
        super();
        this.initSettingsObject<VFSViewSettings>("VFSViewSettings", {
            defaultPreview: false
        });

        this.initSettingsObject<StyleLibrarySettings>("StyleLibrarySettings", {
            previewImage: true
        });
    }

    public initSettingsObject<T = any>(key: string, value: T) {
        isaDB.settings.add({
            id: key,
            value: JSON.stringify(value)
        });
    }

    public async getSettingsObject<T>(key: string): Promise<T> {
        const isa = await this.getISAEntry(key);
        const obj = JSON.parse(isa!.value);
        return obj as T;
    }

    public async updateSettingsObject<T>(key: string, updater: (prev: T) => T) {
        const obj = await this.getSettingsObject<T>(key);
        const updObj = updater(obj);
        isaDB.settings.update(key, {
            value: JSON.stringify(updObj)
        });
    }

    public async getISAEntry(id: string) {
        return isaDB.settings.get(id);
    }
}
