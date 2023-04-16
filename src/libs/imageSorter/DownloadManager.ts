import {APIShard} from "./APIShard";
import {DuplexEventRelay} from "./DuplexEventRelay";
import JSZip from "jszip";
import {isaDB} from "./ImageSorterAppDB";
import fileDownload from "js-file-download";

export class DownloadManager extends APIShard {

    public async downloadProject(projectID: string, der: DuplexEventRelay) {
        const project = await this.api().getProject(projectID);
        const zip = new JSZip();
        const imageFiles: Array<File> = new Array<File>();
        for (const res of project!.resources) {
            try {
                const imageData = await isaDB.images.get(res);
                let blob: any = imageData?.data!;
                blob.lastModifiedDate = new Date();
                blob.name = `${res}.png`
                imageFiles.push(blob as File);
            } catch (e) {
                console.error(e);
            }
        }
        imageFiles.forEach(file => zip.file(file.name, file));
        const blob = await zip.generateAsync({ type: "blob" });
        // ihp => image hub project
        fileDownload(blob, `${projectID}.ihp.zip`);
    }

    public async downloadImage(imageID: string) {
        const imageData = await isaDB.images.get(imageID);
        let blob: any = imageData?.data!;
        blob.lastModifiedDate = new Date();
        blob.name = `${imageID}.ih.png`
        fileDownload(blob, blob.name);
    }
}
