import {IISOAdapter} from "../IISOAdapter";
import {ISOBase} from "../ISOBase";
import {ISOInstallMethod} from "../ISOInstallMethod";
import {v4} from "uuid";
import {Folder} from "../../data/Folder";
import {AtlasMain} from "../../AtlasMain";
import {IAtlasAPI} from "../../api/IAtlasAPI";
import {Category} from "../../data/Category";
import {AtlasDocument} from "../../data/AtlasDocument";
import {AtlasDB} from "../../api/AtlasDB";
import {DBDocumentAttachment} from "../../data/db/DBDocumentAttachment";
import {FormDataHub} from "../../../base/FormDataHub";
import {ISOV1Data} from "./ISOV1Data";
import {GenericBC} from "../../../base/BernieComponent";
import {DBDocumentBody} from "../../data/db/DBDocumentBody";

export class ISOAdapterV1 implements IISOAdapter {

    /**
     * TODO: Add document bodies to the ISO image
     */
    async createISO(): Promise<ISOBase> {
        const api: IAtlasAPI = AtlasMain.atlas().api();

        // Load all data from local storage
        const db: FormDataHub = AtlasMain.atlas().api().db();
        const folders: Array<Folder> = api.getAllFolders();
        const categories: Array<Category> = api.getAllCategories();
        const documents: Array<AtlasDocument> = api.getAllDocuments();

        // Load all data from indexeddb
        const persistentDB: AtlasDB = api.persistentDB();
        const documentAttachments: Array<DBDocumentAttachment> = await persistentDB.documentAttachments.toArray();
        const documentBodies: Array<DBDocumentBody> = await persistentDB.documentBodies.toArray();

        // await persistentDB.documentBodies.add({
        //     id: v4(),
        //     value: "test value"
        // });

        console.debug(await persistentDB.documentBodies.count())

        const v1: ISOV1Data = {
            folders: folders,
            documents: documents,
            categories: categories,
            documentAttachments: documentAttachments,
            documentBodies: documentBodies
        }

        return {
            timestamp: new Date().toISOString(),
            version: "v1",
            id: v4(),
            data: v1
        };
    }

    /**
     * TODO: If folder is present -> Merge the new folder into the old one -> especially the sub-folder-ids
     * TODO: Load document bodies to the database -> dexie bulk_add
     */
    install(method: ISOInstallMethod, iso: ISOBase, dialogDOMEntry: GenericBC): void {
        const api: IAtlasAPI = AtlasMain.atlas().api();
        const data: ISOV1Data = iso.data

        function install() {

            // Install data to local store
            api.createDocument(...data.documents);
            api.createCategory(...data.categories);

            const oldFolders = api.getAllFolders();
            const newFolders = data.folders;
            const newCollidingFolders: Array<Folder> = [];
            const newNonCollidingFolders: Array<Folder> = [];

            // Separate colliding & non-colliding folders
            newFolders.forEach(newFolder => {
                const id = newFolder.id;
                // Get a possibly colliding folder :: Data inconsistencies like recurring ids aren't taken into account!
                const collisions = oldFolders.filter(oldFolder => oldFolder.id === id);
                const collidingOldFolder = collisions.length === 0 ? undefined : collisions[0];
                if (collidingOldFolder === undefined) {
                    // No collisions found
                    newNonCollidingFolders.push(newFolder);
                } else {
                    // One or more collisions found
                    newCollidingFolders.push(newFolder);
                }
            });

            // Create all non-colliding folders
            api.createFolder(...newNonCollidingFolders);

            // Merge all colliding folders with their currently present counterpart
            newCollidingFolders.forEach(newFolder => {
                api.updateFolder(newFolder.id, apiFolder => {
                    if (apiFolder.subFolderIDs === undefined) apiFolder.subFolderIDs = [];
                    if (apiFolder.documentsIDs === undefined) apiFolder.documentsIDs = [];
                    if (newFolder.subFolderIDs !== undefined) {
                        newFolder.subFolderIDs.forEach(subFolderID => apiFolder.subFolderIDs!.push(subFolderID));
                    }
                    if (newFolder.documentsIDs !== undefined) {
                        newFolder.documentsIDs.forEach(subFolderID => apiFolder.documentsIDs!.push(subFolderID));
                    }

                    // Merge the new folder (newFolder) into the currently present folder (apiFolder)
                    // TODO: Only add if not present
                    // TODO: Merge more attributes

                    return apiFolder;
                });
            });

            // Install data to indexeddb (persistent store)
            const persistentDB: AtlasDB = api.persistentDB();
            persistentDB.documentAttachments.bulkAdd(data.documentAttachments);
            persistentDB.documentBodies.bulkAdd(data.documentBodies);
        }

        switch (method) {
            case ISOInstallMethod.MERGE:
                install();
                break;
            case ISOInstallMethod.REPLACE:
                api.clear().then(() => install());
                break;
        }
    }
}
