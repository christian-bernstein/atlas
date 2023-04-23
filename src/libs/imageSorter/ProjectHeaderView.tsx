import React, {useContext, useEffect, useState} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {Project} from "./Project";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {CloseRounded, DownloadRounded, EditRounded, SelectAllRounded} from "@mui/icons-material";
import {IconButton} from "./IconButton";
import {Tag} from "./Tag";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";
import {MenuDivider} from "@szhsin/react-menu";
import {BooleanContext} from "../test/BooleanContext";
import {ProjectEditDialog, ProjectEditDialogProps} from "./ProjectEditDialog";

export type ProjectHeaderViewState = {
    editDialogOpened: boolean
}

export const ProjectHeaderView: React.FC = props =>  {
    const api = useContext(ImageSorterAPIContext);
    const state = useContext(ImageSorterAPIStateContext);
    const [localState, setLocalState] = useState<ProjectHeaderViewState>({
        editDialogOpened: false
    });
    const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
    useEffect(() => {
        api.getCurrentProject().then(cp => setCurrentProject(cp));
    }, [api, state]);

    console.log("rendering ProjectHeaderView")

    return (
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
            <>
                { localState.editDialogOpened && (
                    <ProjectEditDialog
                        open={localState.editDialogOpened}
                        for={currentProject?.id!}
                        onSave={project => {}}
                        onCancel={() => {
                            setLocalState(prevState => ({ ...prevState, editDialogOpened: false }))
                        }}
                    />
                ) }

                <div style={{
                    display: "grid",
                    gap: "8px"
                }}>
                    <div style={{
                        display: "grid",
                        alignItems: "center",
                        gridTemplateColumns: "auto min-content"
                    }}>
                        <MainTypography text={currentProject?.title!}/>

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            height: "100%",
                            gap: "4px"
                        }}>
                            <Menu>
                                <MenuButton text={"Edit"} icon={<EditRounded/>} appendix={"Ctrl+E"} onSelect={() => {
                                    setLocalState(prevState => ({ ...prevState, editDialogOpened: true }))
                                }}/>

                                <MenuButton text={"Select all"} icon={<SelectAllRounded/>} onSelect={() => {
                                    api.selectionManager.select(currentProject?.resources ?? []);
                                }}/>

                                <MenuButton text={"Select duplicates"} icon={<SelectAllRounded/>} onSelect={() => {
                                    api.selectionManager.selectDuplicates(currentProject?.resources ?? []);
                                }}/>


                                <MenuButton text={"Download images"} icon={<DownloadRounded/>} onSelect={() => {
                                    if (currentProject?.id === undefined) return;
                                    api.downloadManager.downloadProject(currentProject.id, new DuplexEventRelay()).then(() => {});
                                }}/>

                                <MenuDivider/>

                                <MenuButton text={"Remove cover image"} onSelect={() => {
                                    api.getProjectContext().setPreviewImage(undefined);
                                }}/>

                                {
                                    currentProject?.previewImageID === undefined ? undefined : (
                                        <MenuButton text={"Open cover image"} onSelect={() => {
                                            api.selectImageByID(currentProject?.previewImageID!, false)
                                        }}/>
                                    )
                                }
                            </Menu>

                            <IconButton size={"small"} tooltip={"Close"} children={<CloseRounded/>} onClick={() => api.closeProject()}/>
                        </div>
                    </div>

                    { currentProject?.description && (
                        <DescriptiveTypography text={currentProject?.description}/>
                    ) }

                    { currentProject?.tags && currentProject.tags.length > 0 && (
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                            gap: "4px",
                            width: "100%"
                        }}>
                            { currentProject?.tags.map(tag => (
                                <Tag key={tag} tag={tag} onClick={() => {
                                    // TODO: Search for all images with this tag
                                }}/>
                            ))}
                        </div>
                    ) }
                </div>
            </>
        )
    );
}
