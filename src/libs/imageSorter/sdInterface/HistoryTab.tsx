import React, {useContext, useState} from "react";
import {ISADBImageGrid} from "../ISADBImageGrid";
import {isaDB} from "../ImageSorterAppDB";
import {useLiveQuery} from "dexie-react-hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import {Workspace} from "../Workspace";
import {Screen} from "../../base/components/base/Page";
import {ImageView} from "../ImageView";
import {ImagePreview} from "../ImagePreview";
import {ISAImage} from "../ISAImage";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {ImageSorterAPIStateContext} from "../ImageSorterApp";
import {ImageSorterAPIContext} from "../ImageSorterAPI";
import {HistoryTabSelectionView} from "./HistoryTabSelectionView";
import {ControlledImagePreview} from "../ControllerImagePreview";

export type HistoryTabState = {
    openedImageID?: string,
    selectedImages: Array<string>,
    detailedImageView: boolean,
}

export const HistoryTab: React.FC = props => {
    const len = useLiveQuery(() => isaDB.sdInterfaceResults.count());
    const [state, setState] = useState<HistoryTabState>({
        selectedImages: [],
        detailedImageView: false
    });
    const mainState = useContext(ImageSorterAPIStateContext);
    const api = useContext(ImageSorterAPIContext);

    const images = useLiveQuery(async () => isaDB.sdInterfaceResults
        .where("id")
        .anyOfIgnoreCase(state.selectedImages)
        // TODO: remove limit
        .limit(16)
        .toArray(),
        [state.selectedImages]
    );

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "min-content auto",
            gap: "8px",
            width: "100%",
            height: "100%"
        }}>
            <Workspace config={{
                name: "history-image-selector",
                mode: "desktop",
                resizable: true
            }} children={
                <ISADBImageGrid isaTable={"sdInterfaceResults"} imageRenderer={data => (
                    <ControlledImagePreview
                        opened={state.openedImageID === data.id}
                        selected={state.selectedImages.includes(data.id)}
                        onRequestDelete={() => isaDB.sdInterfaceResults.delete(data.id)}
                        key={data.id}
                        for={data}
                        onClick={(event) => {
                            if (event.ctrlKey) {
                                setState(prevState => ({
                                    ...prevState,
                                    selectedImages: Array.from(new Set([...prevState.selectedImages, data.id]))
                                }));
                                return;
                            }
                            setState(prevState => ({ ...prevState, openedImageID: data.id }));
                        }}
                    />
                )}/>
            }/>

            <div style={{
                display: "grid",
                gridTemplateRows: "auto min-content",
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                overflow: "hidden"
            }}>
                <Workspace config={{
                    name: "history-image-selector",
                    mode: "desktop"
                }} children={
                    (!state.openedImageID) ? (
                        <div style={{
                            height: "100%",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex"
                        }}>
                            <DescriptiveTypography text={"No image selected"}/>
                        </div>
                    ) : (
                        <div style={{
                            height: "100%",
                            width: "100%",
                            maxHeight: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex"
                        }}>
                            <ISAImage imageRenderer={i => (
                                <img
                                    style={{
                                        borderRadius: "8px",
                                        height: "auto",
                                        width: "auto",
                                        maxHeight: "100%",
                                        maxWidth: "100%",
                                        cursor: "pointer",
                                        objectFit: "scale-down"
                                    }}
                                    alt={"stable diffusion result"}
                                    src={URL.createObjectURL(i.data)}
                                />
                            )} imageID={state.openedImageID} isaTable={"sdInterfaceResults"}/>
                        </div>
                    )
                }/>

                <HistoryTabSelectionView
                    detailedImageView={state.detailedImageView}
                    toggleDetailedImageView={() => setState(prevState => ({ ...prevState, detailedImageView: !prevState.detailedImageView }))}
                    selectedImages={state.selectedImages}
                    clearSelection={() => setState(prevState => ({ ...prevState, selectedImages: [] }))}
                    removeImageFromSelection={imageID => setState(prevState => ({ ...prevState, selectedImages: prevState.selectedImages.filter(i => i !== imageID) }))}
                />
            </div>

        </div>
    );
}
