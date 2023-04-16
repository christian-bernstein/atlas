import React, {useContext, useRef, useState} from "react";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {FileImportModal} from "./FileImportModal";
import {Modal} from "../triton/components/dialogs/Modal";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {ImportProcessOverviewModal} from "./ImportProcessOverviewModal";

export const FileStructureImportModal: React.FC<{
    open: boolean,
    onClose: () => void
}> = props => {
    const api = useContext(ImageSorterAPIContext);
    const der = useRef(new DuplexEventRelay())
    const [state, setState] = useState({
        importing: false,
        importProcessModalOpen: false,
        expectedImageCount: 0
    });

    return (
        <>
            <FileImportModal open={props.open} onCancel={() => props.onClose()} onSubmit={files => {
                setState(prevState => ({
                    ...prevState,
                    importProcessModalOpen: true,
                    importing: true,
                    expectedImageCount: files.length
                }));

                api.importManager.importFileStructure(files, der.current).then(() => {});
            }}/>

            <ImportProcessOverviewModal der={der.current} expectedImageCount={state.expectedImageCount} open={state.importProcessModalOpen} onClose={() => {
                setState(prevState => ({
                    ...prevState,
                    importProcessModalOpen: false
                }));
            }}/>
        </>
    );
}
