import React, {useContext} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {FileStructureImportModal} from "./FileStructureImportModal";
import {BooleanContext} from "../test/BooleanContext";
import {CreateNewFolderRounded, SelectAllOutlined, UploadRounded} from "@mui/icons-material";
import {IconButton} from "./IconButton";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {ProjectCreationDialog} from "./ProjectCreationDialog";
import {FolderSetupDialog} from "./FolderSetupDialog";

export const VFSViewOptions: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);

    return (
        <>
            <ProjectCreationDialog/>
            <FolderSetupDialog/>

            <div style={{
                display: "grid",
                gridTemplateColumns: "auto repeat(3, min-content)",
                gap: "8px"
            }}>
                <IconButton variant={"primary"} fullwidth children={<MainTypography text={"Create project"} style={{
                    color: "white",
                    fontSize: ".9rem",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    width: "calc(100% - 0px)"
                }}/>} onClick={() => {
                    api.toggleProjectCreationDialog(true);
                }}/>

                <IconButton tooltip={"Create folder"} children={<CreateNewFolderRounded/>} onClick={() => {
                    api.toggleFolderCreationDialog(true);
                }}/>


                <IconButton variant={api.state.selectionMode ? "primary" : "default"} children={<SelectAllOutlined/>} onClick={() => {
                    api.setState(prevState => ({
                        ...prevState,
                        selectionMode: !prevState.selectionMode
                    }));
                }}/>


                <BooleanContext children={(bool, setBool) => (
                    <>
                        <FileStructureImportModal open={bool} onClose={() => setBool(false)}/>
                        <IconButton tooltip={"Import"} children={<UploadRounded/>} onClick={() => {
                            setBool(true)
                        }}/>
                    </>
                )}/>
            </div>
        </>
    );
}
