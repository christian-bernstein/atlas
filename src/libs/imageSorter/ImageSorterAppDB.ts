import Dexie, {Table} from "dexie";
import {Project} from "./Project";
import {VFSElement} from "./VFSElement";
import {Image} from "./Image";
import {ISADBSettingsEntry} from "./ISADBSettingsEntry";
import {StyleData} from "./StyleData";
import {MixinData} from "./sdInterface/MixinData";

export class ImageSorterAppDB extends Dexie {

    projects!: Table<Project>;

    vfsElements!: Table<VFSElement>;

    images!: Table<Image>;

    settings!: Table<ISADBSettingsEntry>;

    styles!: Table<StyleData>

    mixins!: Table<MixinData>

    constructor() {
        super("ImageSorterAppDB");
        this.version(9).stores({
            projects: 'id, title, tags, resources, meta, previewImageID, description',
            vfsElements: 'id, parentID, title, targetID, subElements, projects, type, path, fullPath',
            images: 'id, data, tags',
            settings: 'id, value',
            styles: 'id, title, description, meta, previewID, additionalPreviewIDs, note',
            mixins: 'id, key, type, target'
        });

        this.vfsElements.add({
            id: "root",
            subElements: [],
            parentID: "",
            title: "Root",
            type: "folder",
            path: "",
            fullPath: "Root"
        });
    }
}

export const isaDB = new ImageSorterAppDB();
