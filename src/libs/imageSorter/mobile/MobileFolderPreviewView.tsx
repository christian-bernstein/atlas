import React, {useContext, useEffect, useState} from "react";
import {ImageSorterAPIContext} from "../ImageSorterAPI";
import {ImageSorterAPIStateContext} from "../ImageSorterApp";
import {WorkspaceContext} from "../Workspace";
import {Project} from "../Project";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "../ImageSorterAppDB";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {MainTypography} from "../../triton/components/typography/MainTypography";
import {BooleanContext} from "../../test/BooleanContext";
import {Modal} from "../../triton/components/dialogs/Modal";
import {FileImportModal} from "../FileImportModal";
import {IconButton} from "../IconButton";
import {UploadRounded} from "@mui/icons-material";
import {HOCWrapper} from "../../base/components/HOCWrapper";
import {ISADBImageGrid} from "../ISADBImageGrid";
import {ImagePreview} from "../ImagePreview";
import {Screen} from "../../base/components/base/Page";
import {ImageView} from "../ImageView";
import {MobileISADBImageGrid} from "./MobileISADBImageGrid";

export const MobileFolderPreviewView: React.FC = props => {
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
                        flexGrow: 2,
                        overflow: "hidden",


                        display: "grid",
                        gridTemplateRows: "min-content auto",
                        // height: "100%",
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
                            gap: "8px",
                        }}>
                            <MobileISADBImageGrid imageIDs={currentProject?.resources ?? []} imageRenderer={data => (
                                <ImagePreview
                                    for={data}
                                    key={data.id}
                                    onClick={(event) => {
                                        if (event.ctrlKey) {
                                            api.selectionManager.toggleSelection(data.id);
                                            return;
                                        }
                                        api.selectImageByID(data.id);
                                    }}
                                    onRequestDelete={() => {
                                        // api.removeImageFromCurrentProject(data.id)
                                    }}
                                />
                            )}/>
                        </div>
                    </div>
                )
            }
        </>
    );
}
