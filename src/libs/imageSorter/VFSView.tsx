import React, {useContext, useEffect, useState} from "react";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {VFSFolderContentViewer} from "./VFSFolderContentViewer";
import {ArrowLeftRounded} from "@mui/icons-material";
import {VFSElement} from "./VFSElement";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {IconButton} from "./IconButton";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {ButtonGroup} from "./ButtonGroup";

export const VFSView: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);
    const state = useContext(ImageSorterAPIStateContext);
    const [currentFolder, setCurrentFolder] = useState<VFSElement | undefined>(undefined);
    useEffect(() => {
        const queryStart = Date.now();
        api.getCurrentElement().then(ce => {
            console.debug(`[VFSView] folder query timing: '${Date.now() - queryStart}' ms`);
            setCurrentFolder(ce);
        });
    }, [api, state]);

    return (
        <div style={{
            display: "grid",
            gridTemplateRows: "min-content auto",
            gap: "8px",
            height: "100%",
            borderRadius: ".5rem",
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center"
            }}>
                <ButtonGroup>
                    <IconButton deactivated={api.state.fvsPath.length === 0} size={"small"} tooltip={"Go to root"} children={<>//</>} onClick={() => {
                        api.goToRoot();
                    }}/>
                    <IconButton deactivated={api.state.fvsPath.length === 0} size={"small"} tooltip={"Go back"} children={<ArrowLeftRounded/>} onClick={() => {
                        api.goUpOneLevel();
                    }}/>
                </ButtonGroup>
                <MainTypography text={currentFolder?.title ?? ".."}/>
            </div>
            <VFSFolderContentViewer/>
        </div>
    );
}
