import {Identifiable} from "./Identifiable";
import {AtlasEntity} from "./AtlasEntity";
import {DocumentType} from "./DocumentType";

/**
 * TODO:
 *  - Performance upgrade: Split the storing of the document body.
 *      - The document body should be saved in a faster database -> indexedDB via Dexie
 *      - IF body stored externally:
 *          - ISO images have to be updated: Map<id, body>
 *          - On image creation: Get all db bodies -> store in ISO
 *          - On image installation: Append all db bodies into ISO database
 */
export type AtlasDocument = AtlasEntity & Identifiable & {
    issuer?: string,
    documentType?: DocumentType,
    attachmentIDs?: Array<string>;

    // Old & deprecated method of storing a documents body
    // TODO: Remove this property
    body?: string,

    // Contains a link to documents body -> Typically used to quarry the indexedID
    bodyID?: string,

    // TODO: Implement
    archetypeID?: string
}
