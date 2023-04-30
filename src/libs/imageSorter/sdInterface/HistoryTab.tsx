import React, {useState} from "react";
import {ISADBImageGrid} from "../ISADBImageGrid";
import {isaDB} from "../ImageSorterAppDB";
import {useLiveQuery} from "dexie-react-hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import {Workspace} from "../Workspace";
import {Screen} from "../../base/components/base/Page";
import {ImageView} from "../ImageView";
import {ImagePreview} from "../ImagePreview";
import {ISAImage} from "../ISAImage";

export type HistoryTabState = {
    openedImageID?: string
}

export const HistoryTab: React.FC = props => {
    const len = useLiveQuery(() => isaDB.sdInterfaceResults.count());

    const [state, setState] = useState<HistoryTabState>({});

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
                    <ImagePreview
                        onRequestDelete={() => isaDB.sdInterfaceResults.delete(data.id)}
                        key={data.id}
                        for={data}
                        // TODO: Set key -> But smart lul
                        onClick={(event) => {
                            // if (event.ctrlKey) {
                            //     api.selectionManager.toggleSelection(data.id);
                            //     return;
                            // }
                            setState(prevState => ({ ...prevState, openedImageID: data.id }));
                        }}
                    />
                )}/>
            }/>

            <Workspace config={{
                name: "history-image-selector",
                mode: "desktop"
            }} children={
                (!state.openedImageID) ? "No image selected" : (
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

        </div>
    );
}
