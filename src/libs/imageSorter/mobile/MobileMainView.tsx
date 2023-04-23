import React, {useContext} from "react";
import {AppHeader} from "../AppHeader";
import {Workspace} from "../Workspace";
import {VFSViewOptions} from "../VFSViewOptions";
import {VFSView} from "../VFSView";
import {MobileVFSView} from "./MobileVFSView";
import {MobileFolderPreviewView} from "./MobileFolderPreviewView";
import {ImageSorterAPIContext} from "../ImageSorterAPI";
import {Modal} from "../../triton/components/dialogs/Modal";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {ISAImage} from "../ISAImage";

export const MobileMainView: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);

    return (
        <div style={{
            display: "grid",
            rowGap: "1rem",
            padding: "1rem",
            gridAutoRows: "auto",
            width: "calc(100vw + 0px)",
            height: "calc(100vh - 0.3rem)",
            overflow: "hidden"
        }}>
            <Modal open={api.state.selectedImageId !== undefined} onClose={() => api.unselectImage()} children={
                <ISAImage imageID={api.state.selectedImageId ?? "_fallback"}/>
            }/>

            <div style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "grid",
                gap: "8px"
            }}>
                <div style={{
                    // display: "grid",
                    // gridTemplateRows: "auto min-content min-content",
                    // rowGap: "8px"

                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    overflow: "hidden",
                    maxHeight: "calc(100% - 0px)"
                }}>
                    <MobileFolderPreviewView/>

                    <Workspace style={{
                        flexShrink: 0,
                        height: "min-content"
                    }} children={<MobileVFSView/>} config={{
                        mode: "mobile",
                        name: "vfs"
                    }}/>

                    <Workspace style={{
                        flexShrink: 0,
                        height: "min-content"
                    }} children={<VFSViewOptions/>} config={{
                        mode: "mobile",
                        name: "vfs-options",
                    }}/>
                </div>
            </div>
        </div>
    );
}
