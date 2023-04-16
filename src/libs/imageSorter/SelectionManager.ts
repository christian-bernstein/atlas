import {APIShard} from "./APIShard";

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
}
