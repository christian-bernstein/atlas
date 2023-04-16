export interface Project {
    id: string
    title: string,
    tags: Array<string>,
    resources: Array<string>,
    meta: string,
    previewImageID?: string,
    description?: string
}
