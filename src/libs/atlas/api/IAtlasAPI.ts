import {Folder} from "../data/Folder";
import {AtlasDocument} from "../data/AtlasDocument";
import {Category} from "../data/Category";
import {IPredicate} from "./IPredicate";
import {FormDataHub} from "../../base/FormDataHub";
import {AtlasDB} from "./AtlasDB";
import {IISOAdapter} from "../iso/IISOAdapter";
import {StorageSummary} from "./StorageSummary";
import {DocumentArchetype} from "./DocumentArchetype";
import {IUpdater} from "../utils/IUpdater";
import {UnaryFunction} from "../utils/UnaryFunction";

export interface IAtlasAPI {
    getFolder(id: string): Folder;
    getDocument(id: string): AtlasDocument;
    getCategory(id: string): Category;
    deleteFolder(id: string): boolean;
    deleteCategory(id: string): boolean;
    deleteDocument(id: string): boolean;

    // TODO: Make IPredicate inline lambda
    getAllDocuments(...predicates: Array<IPredicate<AtlasDocument>>): Array<AtlasDocument>;
    getAllFolders(...predicates: Array<IPredicate<Folder>>): Array<Folder>;
    getAllCategories(...predicates: Array<IPredicate<Category>>): Array<Category>;

    createDocument(...data: Array<AtlasDocument>): boolean;
    createCategory(...data: Array<Category>): boolean;
    createFolder(...data: Array<Folder>): boolean;
    updateFolder(id: string, updater: (folder: Folder) => Folder): IAtlasAPI;
    updateCategory(id: string, updater: (category: Category) => Category): IAtlasAPI;
    updateDocument(id: string, updater: (document: AtlasDocument) => AtlasDocument): IAtlasAPI;
    linkCategoryToFolder(categoryID: string, folderID: string): void;
    linkDocumentToCategory(documentID: string, categoryID: string): void;
    createSubFolder(parentFolderID: string, subFolder: Folder): void;
    createDocumentInFolder(folderID: string, data: AtlasDocument): void;
    db(): FormDataHub;
    clear(): Promise<IAtlasAPI>;
    persistentDB(): AtlasDB;
    isoAdapter(id: string): IISOAdapter;

    importFiles(folderID: string, files: Array<File>): Promise<void>;
    getFolderFromPath(baseFolderID: string, path: Array<string>): Folder;


    getDocumentArchetype(archetypeID: string): DocumentArchetype;

    getStorageSummary(recalculate: boolean): StorageSummary;
    recalculateStorageSummary(): void;


    /**
     * Load a document body.
     *
     * @param documentID The documents id, who's corresponding document's body will be loaded.
     */
    getDocumentBody(documentID: string): Promise<{
        // The documents body -> If error or N/A: Empty string
        value: string,
        // A number representation of the success/error code of the operation
        code: number
        // A fast way to determine if a query was successful and returned an immediately usable value or not
        success: boolean
    }>;

    updateDocumentBody(documentID: string, updater: UnaryFunction<string>): Promise<void>;

    /**
     * Overwrites a documents body value.
     * The main difference to updateDocumentBody(..) is that this overwriteDocumentBody(..) doesn't query
     * the documents body before updating it.
     * If the value will just be overwritten, use overwriteDocumentBody(..) it's the fastest way to update
     * a documents body.
     *
     * @param documentID
     * @param newDocumentBody
     */
    overwriteDocumentBody(documentID: string, newDocumentBody: string): Promise<void>;
}
