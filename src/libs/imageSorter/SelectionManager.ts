import {APIShard} from "./APIShard";
import {isaDB} from "./ImageSorterAppDB";
import {Image} from "./Image";

export class SelectionManager extends APIShard {

    public clearAndCloseSelection() {
        this.api().setState(prevState => ({
            ...prevState,
            selectedImages: [],
            selectionMode: false
        }));
    }

    public activateSelectionMode() {
        this.api().setState(prevState => ({
            ...prevState,
            selectionMode: true
        }));
    }

    public isSelected(imageID: string) {
        return this.api().state.selectedImages.includes(imageID);
    }

    public toggleSelection(imageID: string) {
        if (this.api().state.selectedImages.includes(imageID)) {
            const empty = this.api().state.selectedImages.length - 1 === 0;
            this.api().setState(prevState => ({
                ...prevState,
                selectedImages: prevState.selectedImages.filter(s => s !== imageID),
                selectionMode: !empty
            }));
        } else {
            this.api().setState(prevState => ({
                ...prevState,
                selectedImages: [imageID, ...prevState.selectedImages],
                selectionMode: true
            }));
        }
    }

    public select(imageIDs: Array<string>) {
        this.api().setState(prevState => ({
            ...prevState,
            selectedImages: Array.from(new Set([...imageIDs, ...prevState.selectedImages])),
            selectionMode: true
        }));
    }

    public async selectDuplicates(imageIDs: Array<string>) {
        const blobCompare = require('blob-compare').default;
        const duplicated: string[] = [], duplicateOriginals: string[] = [];
        const images = (await isaDB.images.bulkGet(imageIDs)) as Image[];
        for (let i1 = 0; i1 < images.length; i1++){
            const i = images[i1];
            let found = false;
            for (let i2 = 0; i2 < images.length; i2++){
                const j = images[i2];
                if (i1 === i2 || duplicateOriginals.includes(j.id)) continue;
                if (await blobCompare.isEqual(i.data, j.data)) {
                    if (!duplicateOriginals.includes(i.id)) duplicated.push(i.id);
                    found = true;
                }
            }
            if (found) duplicateOriginals.push(i.id);
        }
        if (duplicated.length > 0) this.select(duplicated);
    }
}
