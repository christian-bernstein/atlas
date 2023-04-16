export interface VFSElement {
    id: string,
    parentID: string,
    title: string,
    // project id
    targetID?: string,
    subElements?: Array<string>,
    projects?: Array<string>,
    type: "project" | "folder",
    path: string,
    fullPath: string
}
