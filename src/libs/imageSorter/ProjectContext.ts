import {isaDB} from "./ImageSorterAppDB";

export class ProjectContext {

    private readonly projectID: string;

    constructor(projectID: string) {
        this.projectID = projectID;
    }

    public setPreviewImage(id: string | undefined) {
        isaDB.projects.update(this.projectID, {
            "previewImageID": id
        });
    }
}
