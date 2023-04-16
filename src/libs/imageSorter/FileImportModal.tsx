import React, {useState} from "react";
import {FileDropzone} from "../atlas/components/FileDropzone";
import {DeleteRounded} from "@mui/icons-material";
import {Modal} from "../triton/components/dialogs/Modal";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {Image} from "./Image";
import {BaseImageGrid} from "./BaseImageGrid";
import {createUnzip} from "zlib";
import JSZip from "jszip";

export type FileImportModalProps = {
    open: boolean,
    onSubmit: (files: File[]) => void,
    onCancel: () => void
}

export type FileImportModalState = {
    files: File[],
}

export const FileImportModal: React.FC<FileImportModalProps> = props => {
    const [state, setState] = useState<FileImportModalState>({
        files: []
    });

    return (
        <Modal preventClosingOnBackdropClick title={"Import images"} open={props.open} onClose={() => props.onCancel()} children={
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px"
            }}>
                <FileDropzone onDrop={async (acceptedFiles, fileRejections, event) => {
                    const preprocessedFiles: Array<File> = [];
                    for (const file of acceptedFiles) {
                        if (file.type === "application/x-zip-compressed") {
                            const zip = await JSZip.loadAsync(file);
                            for (let jsZipObject of zip.filter(() => true)) {
                                preprocessedFiles.push(new File([await jsZipObject.async("blob")], jsZipObject.name));
                            }
                        } else {
                            preprocessedFiles.push(file);
                        }
                    }
                    setState(prevState => ({
                        ...prevState,
                        files: [...prevState.files, ...preprocessedFiles]
                    }));
                }}/>

                {
                    state.files.length > 0 ? (
                        <BaseImageGrid images={state.files.map(f => ({
                            id: f.name,
                            data: f.slice()
                        }) as Image)}/>
                    ) : (<></>)
                }

            </div>
        } footer={
            <div style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "min-content auto",
                gap: "8px"
            }}>
                <ButtonBase children={
                    <DeleteRounded style={{
                        width: "20px",
                        height: "20px"
                    }}/>
                } baseProps={{
                    type: "button",
                    onClick: () => {
                        setState(prevState => ({
                            ...prevState,
                            files: []
                        }));
                    }
                }}/>

                <ButtonBase text={"Import"} baseProps={{
                    type: "button",
                    onClick: () => {
                        props.onSubmit(state.files);
                    }
                }}/>




            </div>
        }/>
    );
}
