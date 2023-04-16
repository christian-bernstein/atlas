import {ImageSorterAPI} from "./ImageSorterAPI";
import {isaDB} from "./ImageSorterAppDB";

export abstract class APIShard {

    private _api: ImageSorterAPI | undefined;

    public setApi(api: ImageSorterAPI) {
        if (this._api === undefined) {
            this._api = api;
        }
    }

    public api(): ImageSorterAPI {
        return this._api!;
    }
}

(window as any).api = new (class {
    public async reset() {
        let success = true;
        try {
            await isaDB.vfsElements.clear();
            await isaDB.projects.clear();
            await isaDB.images.clear();
        } catch (e) {
            console.error(e);
            success = false;
        }
        if (success) window.location.reload();
    }

    public async dumpVFS() {
        await isaDB.vfsElements.each(obj => {
            console.log(obj)
        })
    }

    public async dumpVFSPaths() {
        await isaDB.vfsElements.each(obj => {
            console.log(`[P] '${obj.path}' / [T] '${obj.title}'`)
        })
    }
})();
