import {IAtlasAPI} from "./IAtlasAPI";
import {Folder} from "../data/Folder";
import {AtlasDocument} from "../data/AtlasDocument";
import {Category} from "../data/Category";
import {IPredicate} from "./IPredicate";
import {FormDataHub} from "../../base/FormDataHub";
import {AtlasDB} from "./AtlasDB";
import {IISOAdapter} from "../iso/IISOAdapter";
import {ISOAdapterV1} from "../iso/v1/ISOAdapterV1";
import {v4} from "uuid";
import {StorageSummary} from "./StorageSummary";
import {DocumentArchetype} from "./DocumentArchetype";
import {GenericFileArchetype} from "../data/documentArchetypes/GenericFileArchetype";
import {DocumentType} from "../data/DocumentType";

enum DBAddresses {
    DOCUMENTS = "documents",
    FOLDERS = "folders",
    CATEGORIES = "categories"
}

export class InDevAtlasAPI implements IAtlasAPI {

    private static readonly STORAGE_SUMMARY_ID: string = "storage_summary";

    private database: FormDataHub = new FormDataHub("InDevAtlasAPI").loadFromLocalStore();

    private persistentDatabase: AtlasDB = new AtlasDB("InDevAtlasAPI");

    private meta: FormDataHub = new FormDataHub("InDevAtlasAPI_meta").loadFromLocalStore();

    createDocument(...data: Array<AtlasDocument>): boolean {
        try {
            data.forEach(d => {
                try {
                    const documents: Array<AtlasDocument> = this.database.get(DBAddresses.DOCUMENTS, []);
                    documents.push(d);
                    this.database.set(DBAddresses.DOCUMENTS, documents, true);
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            });
            return true
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    createFolder(...data: Array<Folder>): boolean {
        try {
            data.forEach(d => {
                try {
                    const folders: Array<Folder> = this.database.get(DBAddresses.FOLDERS, []);
                    folders.push(d);
                    this.database.set(DBAddresses.FOLDERS, folders, true);
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            });
            return true
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    createCategory(...data: Array<Category>): boolean {
        try {
            data.forEach(d => {
                try {
                    const categories: Array<Category> = this.database.get(DBAddresses.CATEGORIES, []);
                    categories.push(d);
                    this.database.set(DBAddresses.CATEGORIES, categories, true);
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            });
            return true
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getAllCategories(...predicates: Array<IPredicate<Category>>): Array<Category> {
        let categories: Array<Category> = this.database.get(DBAddresses.CATEGORIES, []);
        predicates.forEach(predicate => {
            categories = categories.filter(category => predicate.test(category));
        });
        return categories;
    }

    getCategory(id: string): Category {
        return this.getAllCategories({
            test(obj: Category): boolean {
                return obj.id === id;
            }
        })[0];
    }

    getAllFolders(...predicates: Array<IPredicate<Folder>>): Array<Folder> {
        let folders: Array<Folder> = this.database.get(DBAddresses.FOLDERS, []);
        predicates.forEach(predicate => {
            folders = folders.filter(folders => predicate.test(folders));
        });
        return folders;
    }

    getFolder(id: string): Folder {
        return this.getAllFolders({
            test(obj: Folder): boolean {
                return obj.id === id;
            }
        })[0];
    }

    getAllDocuments(...predicates: Array<IPredicate<AtlasDocument>>): Array<AtlasDocument> {
        let documents: Array<AtlasDocument> = this.database.get(DBAddresses.DOCUMENTS, []);
        predicates.forEach(predicate => {
            documents = documents.filter(document => predicate.test(document));
        });
        return documents;
    }

    getDocument(id: string): AtlasDocument {
        return this.getAllDocuments({
            test(obj: AtlasDocument): boolean {
                return obj.id === id;
            }
        })[0];
    }

    linkCategoryToFolder(categoryID: string, folderID: string): void {
        this.updateFolder(folderID, folder => {
            const categories = folder.categories;
            categories.push(categoryID);
            folder.categories = categories;
            return folder;
        });
    }

    linkDocumentToCategory(documentID: string, categoryID: string) {
        this.updateCategory(categoryID, category => {
            const documents = category.documents;
            documents.push(documentID);
            category.documents = documents;
            return category;
        });
    }

    deleteFolder(id: string): boolean {
        let folders = this.getAllFolders();
        const lenBefore = folders.length;
        const targetFolder = folders.filter(folder => folder.id === id);
        folders = folders.filter(folder => folder.id !== id);
        const lenAfter = folders.length;
        this.database.set(DBAddresses.FOLDERS, folders, true);

        // TODO: Control this recursive behaviour directly!
        if (targetFolder.length > 0) {
            const folder = targetFolder[0];
            folder.documentsIDs?.forEach(documentID => this.deleteDocument(documentID));
            folder.subFolderIDs?.forEach(subFolderID => this.deleteFolder(subFolderID));
        }

        return lenBefore > lenAfter;
    }

    deleteCategory(id: string): boolean {
        let categories = this.getAllCategories();
        const lenBefore = categories.length;
        categories = categories.filter(category => category.id !== id);
        const lenAfter = categories.length;
        this.database.set(DBAddresses.CATEGORIES, categories, true);
        return lenBefore > lenAfter;
    }

    deleteDocument(id: string): boolean {
        let documents = this.getAllDocuments();
        const lenBefore = documents.length;
        documents = documents.filter(document => document.id !== id);
        const lenAfter = documents.length;
        this.database.set(DBAddresses.DOCUMENTS, documents, true);
        return lenBefore > lenAfter;
    }

    updateCategory(id: string, updater: (category: Category) => Category): IAtlasAPI {
        const updated = updater(this.getCategory(id));
        let categories = this.getAllCategories();
        categories = categories.filter(category => category.id !== id);
        categories.push(updated);
        this.database.set(DBAddresses.CATEGORIES, categories, true);
        return this;
    }

    updateDocument(id: string, updater: (document: AtlasDocument) => AtlasDocument): IAtlasAPI {
        const updated = updater(this.getDocument(id));
        let documents = this.getAllDocuments();
        documents = documents.filter(document => document.id !== id);
        documents.push(updated);
        this.database.set(DBAddresses.DOCUMENTS, documents, true);
        return this;
    }

    updateFolder(id: string, updater: (folder: Folder) => Folder): IAtlasAPI {
        const updated = updater(this.getFolder(id));
        let folders = this.getAllFolders();
        folders = folders.filter(folder => folder.id !== id);
        folders.push(updated);
        this.database.set(DBAddresses.FOLDERS, folders, true);
        return this;
    }

    db(): FormDataHub {
        return this.database;
    }

    async clear(): Promise<IAtlasAPI> {
        for (const table of this.persistentDatabase.tables) {
            await table.clear();
        }
        window.localStorage.removeItem(this.db().key());
        this.database = new FormDataHub("InDevAtlasAPI").loadFromLocalStore();
        return this;
    }

    persistentDB(): AtlasDB {
        return this.persistentDatabase;
    }

    isoAdapter(id: string): IISOAdapter {
        // TODO: Make better
        return new ISOAdapterV1();
    }

    createSubFolder(parentFolderID: string, subFolder: Folder): void {
        if (this.createFolder(subFolder)) {
            this.updateFolder(parentFolderID, folder => {
                let subFolderIDs = folder.subFolderIDs ?? new Array<string>();
                subFolderIDs.push(subFolder.id);
                folder.subFolderIDs = subFolderIDs;
                return folder;
            });
        }
    }

    createDocumentInFolder(folderID: string, data: AtlasDocument) {
        if (this.createDocument(data)) {
            this.updateFolder(folderID, folder => {
                const docs = folder.documentsIDs ?? new Array<string>();
                docs.push(data.id);
                folder.documentsIDs = docs;
                return folder;
            });
        }
    }

    importFiles(folderID: string, files: Array<File>) {
        files.forEach(async (file, index, array) => {
            const path = ((file as any).path as string).match(/(.*\/)/g)?.[0]!.split("/")!.filter(s => s.trim().length > 0)!;

            let folder: Folder = this.getFolder(folderID);
            path?.forEach(elem => {
                let element = folder.subFolderIDs
                    ?.map(sfID => this.getFolder(sfID))
                    ?.filter(f => f !== undefined && f.title === elem)
                    ?.[0] ?? undefined;
                if (element === undefined) {
                    const newFolder: Folder = {
                        id: v4(),
                        title: elem,
                        categories: [],
                        parentFolder: folder.id
                    }
                    this.createSubFolder(folder.id, newFolder);
                    element = newFolder;
                }
                folder = element!;
            });

            const fileContent = await new Promise(resolve => {
                // TODO: This creates a cached blob -> does not really store the data..
                resolve(URL.createObjectURL(file));
            });

            this.createDocumentInFolder(this.getFolderFromPath(folderID, path).id, {
                id: v4(),
                title: file.name,
                documentType: DocumentType.GENERIC_FILE,
                body: JSON.stringify({
                    filename: file.name,
                    filetype: file.type,
                    body: fileContent
                } as GenericFileArchetype)
            });
        });
    }

    getFolderFromPath(baseFolderID: string, path: Array<string>): Folder {
        let folder: Folder = this.getFolder(baseFolderID);
        path?.forEach(elem => {
            let element = folder.subFolderIDs?.map(sfID => this.getFolder(sfID)).filter(f => f !== undefined && f.title === elem)[0];
            folder = element!;
        });
        return folder;
    }

    getDocumentArchetype(archetypeID: string): DocumentArchetype {
        return {
            id: "implement",
            name: "Implement..",
            archetypeFamily: "implement"
        }
    }

    /**
     * Important: Setting the "recalculate" flag to true causes the storage summary to be renewed.
     * This process iterates multiple times over the list of documents. Be aware that this operation can become
     * resource-intense quite quickly.
     * A lightweight solution will come soon.
     *
     * @param recalculate
     */
    getStorageSummary(recalculate: boolean = false): StorageSummary {
        if (recalculate || this.meta.get(InDevAtlasAPI.STORAGE_SUMMARY_ID) === undefined) {
            this.recalculateStorageSummary();
        }
        return this.meta.get(InDevAtlasAPI.STORAGE_SUMMARY_ID);
    }

    /**
     * When should the summary be recalculated?
     * - On every application start
     * - On document deletion
     * - On document creation
     * - On archetype change? -> *If this becomes a thing*
     * - On document body change -> *This might become very resource intense -> Introduction of 'Summary patching' (Manually changing parts of the summary)*
     */
    recalculateStorageSummary(): void {
        const documents = this.getAllDocuments();
        const usedBytes = documents.map(doc => new Blob([doc.body ?? ""]).size).reduceRight((pVal, cVal) => pVal + cVal);
        const defaultArchetype = "default_archetype";
        const docsByArchetype = new Map<DocumentArchetype, Set<AtlasDocument>>();

        documents.forEach(doc => {
            const archetype = this.getDocumentArchetype(doc.archetypeID ?? defaultArchetype);
            const sum = Array.from(docsByArchetype.entries()).filter(([arch]) => arch.id === archetype.id);
            if (sum.length === 0) {
                docsByArchetype.set(archetype, new Set([doc]));
            } else {
                sum[0][1].add(doc);
            }
        });

        this.meta.set(InDevAtlasAPI.STORAGE_SUMMARY_ID, {
            fileCount: documents.length,
            unixCreationTimestamp: new Date().getDate(),
            usedBytes: usedBytes,
            archetypeSummaries: Array.from(docsByArchetype.entries()).map(([aType, aDocs]) => {
                return ({
                    archetype: aType,
                    fileCount: aDocs.size,
                    usedBytes: Array.from(aDocs.values()).map(doc => new Blob([doc.body ?? ""]).size).reduceRight((pVal, cVal) => pVal + cVal)
                });
            })
        } as StorageSummary);
    }
}
