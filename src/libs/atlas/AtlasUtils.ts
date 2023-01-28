export namespace AtlasUtils {

    export function dataURItoBlob(dataURI: string) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this

        // const byteString = atob(dataURI.split(',')[1]);
        const byteString = Buffer.from(dataURI.split(',')[1], 'base64').toString();
        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new Blob([ab], {type: mimeString});
    }
}
