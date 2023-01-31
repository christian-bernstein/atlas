import {Folder} from "../../data/Folder";
import {Category} from "../../data/Category";
import {AtlasDocument} from "../../data/AtlasDocument";
import {DBDocumentAttachment} from "../../data/db/DBDocumentAttachment";

export type ISOV1Data = {
    folders: Array<Folder>,
    categories: Array<Category>,
    documents: Array<AtlasDocument>,
    documentAttachments: Array<DBDocumentAttachment>
}
