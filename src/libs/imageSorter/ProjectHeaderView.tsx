import React, {useContext, useEffect, useState} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {Project} from "./Project";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {CloseRounded, DownloadRounded, EditRounded, MoreVertRounded} from "@mui/icons-material";
import {IconButton} from "./IconButton";
import {Tag} from "./Tag";
import {DuplexEventRelay} from "./DuplexEventRelay";

export const ProjectHeaderView: React.FC = props =>  {
    const api = useContext(ImageSorterAPIContext);
    const state = useContext(ImageSorterAPIStateContext);
    const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
    useEffect(() => {
        api.getCurrentProject().then(cp => setCurrentProject(cp));
    }, [api, state]);

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
                        <IconButton size={"small"} tooltip={"Edit"} children={<EditRounded/>} onClick={() => {}}/>
                        <IconButton size={"small"} tooltip={"More"} children={<MoreVertRounded/>} onClick={() => {}}/>
                        <IconButton size={"small"} children={<DownloadRounded/>} onClick={() => {
                            if (currentProject?.id === undefined) return;
                            api.downloadManager.downloadProject(currentProject.id, new DuplexEventRelay()).then(() => {});
                        }}/>
                        <IconButton size={"small"} tooltip={"Close"} children={<CloseRounded/>} onClick={() => api.closeProject()}/>
                    </div>
                </div>

                <DescriptiveTypography text={currentProject?.description}/>

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
            </div>
        )
    );
}
