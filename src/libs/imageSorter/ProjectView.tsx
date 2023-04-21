import React, {useContext, useEffect, useState} from "react";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {Project} from "./Project";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {BooleanContext} from "../test/BooleanContext";
import {Modal} from "../triton/components/dialogs/Modal";
import {FileImportModal} from "./FileImportModal";
import {isaDB} from "./ImageSorterAppDB";
import {useLiveQuery} from "dexie-react-hooks";
import {ImagePreview} from "./ImagePreview";
import {MetaDisplay} from "./MetaDisplay";
import "./css/react-resizable-styles.css";
import {ISADBImageGrid} from "./ISADBImageGrid";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {WorkspaceContext} from "./Workspace";
import {HOCWrapper} from "../base/components/HOCWrapper";
import {ImageView} from "./ImageView";
import {Screen} from "../base/components/base/Page";
import {IconButton} from "./IconButton";
import {UploadRounded} from "@mui/icons-material";

export const ProjectView: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);
    const state = useContext(ImageSorterAPIStateContext);
    const workspace = useContext(WorkspaceContext);
    const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
    useEffect(() => {
        api.getCurrentProject().then(cp => setCurrentProject(cp));
    }, [api, state]);

    const images = useLiveQuery(async () => {
        return isaDB.images
            .where("id")
            .anyOfIgnoreCase(currentProject?.resources ?? [])
            .limit(16)
            .toArray();
    }, [currentProject]);

    return (
        <>
            {
                state.selectedProject === undefined ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}>
                        <DescriptiveTypography text={"Select a project"}/>
                    </div>
                ) : (
                    <div style={{
                        flexShrink: 2,
                        // overflowY: "scroll",
                        // overflowX: "visible",

                        display: "grid",
                        gridTemplateRows: "min-content auto",
                        height: "100%",
                        gap: "8px",
                    }}>
                        <div style={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            <MainTypography text={"Images"}/>

                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                height: "100%",
                                gap: "4px"
                            }}>
                                <BooleanContext children={(bool, setBool) => (
                                    <>
                                        <Modal title={"Import images"} open={bool} onClose={() => setBool(false)} children={
                                            <FileImportModal open={bool} onCancel={() => setBool(false)} onSubmit={files => {
                                                api.appendFilesToCurrentProject(files).then(() => {});
                                            }}/>
                                        }/>
                                        <IconButton onClick={() => setBool(true)} size={"small"} children={<UploadRounded/>}/>
                                    </>
                                )}/>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "column",
                            gap: "8px"
                        }}>
                            <HOCWrapper body={wrapper => (
                                <ISADBImageGrid imageIDs={currentProject?.resources ?? []} imageRenderer={data => (
                                    <ImagePreview
                                        for={data}
                                        // TODO: Set key -> But smart lul
                                        // key={data.id}
                                        onClick={(event) => {
                                            if (event.ctrlKey) {
                                                api.selectionManager.toggleSelection(data.id);
                                                return;
                                            }
                                            api.selectImageByID(data.id);
                                            if (workspace.mode === "mobile") {
                                                wrapper.dialog(
                                                    <Screen style={{ backgroundColor: "#1a1a20" }} children={
                                                        <div style={{
                                                            height: "100%",
                                                            width: "100%"
                                                        }}>
                                                            <ImageView/>
                                                        </div>
                                                    }/>
                                                );
                                            }
                                        }}
                                        onRequestDelete={() => api.removeImageFromCurrentProject(data.id)}
                                    />
                                )}/>
                            )}/>
                            {
                                (images !== undefined && images.length === 0) ? (
                                    <DescriptiveTypography text={"No images"}/>
                                ) : undefined
                            }
                        </div>
                    </div>
                )
            }
        </>
    );
}
