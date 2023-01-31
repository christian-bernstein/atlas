import Dexie, {Table} from "dexie";
import {DBDocumentAttachment} from "../data/db/DBDocumentAttachment";
import {DBDocumentBody} from "../data/db/DBDocumentBody";

export class AtlasDB extends Dexie {

    public documentAttachments!: Table<DBDocumentAttachment>

    public documentBodies!: Table<DBDocumentBody>

    constructor(id: string, version: number = 1) {
        super(id);
        this.version(version).stores({
            documentAttachments: "id,type,src",
            documentBodies: "id,value"
        });
    }
}
