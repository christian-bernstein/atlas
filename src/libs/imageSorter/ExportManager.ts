import {APIShard} from "./APIShard";
import {ExportRequest} from "./ExportRequest";
import JSZip from "jszip";
import {isaDB} from "./ImageSorterAppDB";
import fileDownload from "js-file-download";
import {v4} from "uuid";
import {Image} from "./Image";

export class ExportManager extends APIShard {

    private async exportSingleImage(request: ExportRequest) {
        const imageFiles: Array<File> = new Array<File>();
        const aggregate: Array<Image> = new Array<Image>();
        await this.processImages(request, imageFiles, aggregate);
        if (request.applySubmittedTag) this.applySubmittedTag(aggregate);
        this.handleDownload(imageFiles[0].slice(), request, "png");
    }

    private async exportImageBadge(request: ExportRequest) {
        const zip = new JSZip();
        const imageFiles: Array<File> = new Array<File>();
        const aggregate: Array<Image> = new Array<Image>();
        await this.processImages(request, imageFiles, aggregate);
        imageFiles.forEach(file => zip.file(file.name, file));
        const blob = await zip.generateAsync({type: "blob"});
        if (request.applySubmittedTag) this.applySubmittedTag(aggregate);
        this.handleDownload(blob, request, "zip");
    }

    private handleDownload(blob: Blob, request: ExportRequest, fileType: string) {
        const providedTitleIsValid = request.fileTitle !== undefined && request.fileTitle.trim().length > 0;
        // ihp => image hub project
        fileDownload(blob, `${providedTitleIsValid ? request.fileTitle : v4().replaceAll("-", "").substring(0, 6)}.${fileType}`);
    }

    private async removeMetaData(blob: Blob): Promise<Blob> {
        const bmp = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = bmp.width;
        canvas.height = bmp.height;
        const ctx = canvas.getContext('bitmaprenderer')!;
        ctx.transferFromImageBitmap(bmp);
        return await new Promise((res) => canvas.toBlob(res as any));
    }

    private applySubmittedTag(aggregate: Array<Image>) {
        for (const res of aggregate) {
            if (res.tags?.includes("submitted")) continue;
            if (res.tags === undefined) res.tags = [];
            res.tags.push("submitted");
            isaDB.images.update(res, {
                tags: res.tags
            });
        }
    }

    private async processImages(request: ExportRequest, imageFiles: Array<File>, aggregate: Array<Image>) {
        for (const res of request.selectedImages) {
            try {
                let imageData = await isaDB.images.get(res);
                if (imageData !== undefined) aggregate.push(imageData);
                let blob: any = imageData?.data!;
                if (request.removeMetadata) blob = await this.removeMetaData(await imageData?.data!);
                blob.lastModifiedDate = new Date();
                blob.name = `${res}.png`;
                imageFiles.push(blob as File);
            } catch (e) {
                console.error(e);
            }
        }
    }

    public async exportImages(request: ExportRequest) {
        if (request.selectedImages.length === 1) {
            await this.exportSingleImage(request);
        } else {
            await this.exportImageBadge(request);
        }
    }
}
