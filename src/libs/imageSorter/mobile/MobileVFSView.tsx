import React, {useContext, useEffect, useState} from "react";
import {ImageSorterAPIContext} from "../ImageSorterAPI";
import {ImageSorterAPIStateContext} from "../ImageSorterApp";
import {VFSElement} from "../VFSElement";
import {useSettings} from "../SettingsHook";
import {VFSViewSettings} from "../VFSViewSettings";
import {ButtonGroup} from "../ButtonGroup";
import {IconButton} from "../IconButton";
import {
    ArrowLeftRounded,
    CreateNewFolderRounded,
    CreateRounded,
    MoreVertRounded,
    UploadRounded
} from "@mui/icons-material";
import {MainTypography} from "../../triton/components/typography/MainTypography";
import {Menu} from "../Menu";
import {CheckMenuButton, MenuButton} from "../MenuButton";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {BooleanContext} from "../../test/BooleanContext";
import {FileStructureImportModal} from "../FileStructureImportModal";
import {MenuDivider} from "@szhsin/react-menu";
import {VFSFolderContentViewer} from "../VFSFolderContentViewer";
import {VFSViewSettingsContext} from "../VFSView";
import {MobileVFSFolderContentViewer} from "./MobileVFSFolderContentViewer";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {CollapseIconButton} from "../CollapseIconButton";

export type MobileVFSViewLocalState = {
    collapsed: boolean
}

export const MobileVFSView: React.FC = props => {
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

    const settings = useSettings<VFSViewSettings>("VFSViewSettings") ?? {
        defaultPreview: false
    };

    const [localState, setLocalState] = useState<MobileVFSViewLocalState>({
        collapsed: false
    });

    return (
        <VFSViewSettingsContext.Provider value={settings} children={
            <div style={{
                display: "grid",
                gridTemplateRows: "auto min-content",
                // gap: "8px",
                height: "100%",
                borderRadius: ".5rem",
            }}>
                <TransitionGroup style={{
                    overflow: "hidden",
                    maxWidth: "calc(100% - 0px)",
                    width: "100%"
                }} children={
                    !localState.collapsed && (
                        <Collapse sx={{
                            marginBottom: "8px !important"
                        }} children={
                            <MobileVFSFolderContentViewer/>
                        }/>
                    )
                }/>

                <div style={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: "auto min-content",
                    gap: "8px",
                    alignItems: "center"
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

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "8px",
                        alignItems: "center"
                    }}>
                        <Menu menuProps={{ direction: "top" }} opener={<IconButton size={"small"} children={<MoreVertRounded/>}/>}>
                            <MenuButton text={"Create project"} icon={<CreateRounded/>} appendix={<DescriptiveTypography text={"Ctrl+N"}/>} onSelect={() => {
                                api.toggleProjectCreationDialog(true);
                            }}/>

                            <MenuButton text={"Create folder"} icon={<CreateNewFolderRounded/>} onSelect={() => {
                                api.toggleFolderCreationDialog(true);
                            }}/>

                            <BooleanContext children={(bool, setBool) => (
                                <>
                                    <FileStructureImportModal open={bool} onClose={() => setBool(false)}/>
                                    <MenuButton text={"Import"} icon={<UploadRounded/>} appendix={<DescriptiveTypography text={"Ctrl+U"}/>} onSelect={() => {
                                        setBool(true)
                                    }}/>
                                </>
                            )}/>

                            <MenuDivider/>

                            <CheckMenuButton text={"Default preview"} checked={settings.defaultPreview} onSelect={() => {
                                api.settingsManager.updateSettingsObject<VFSViewSettings>("VFSViewSettings", prev => ({
                                    ...prev,
                                    defaultPreview: !prev.defaultPreview
                                })).then(() => {});
                            }}/>
                        </Menu>

                        <CollapseIconButton open={!localState.collapsed} onToggle={open => {
                            setLocalState(prevState => ({ ...prevState, collapsed: !open }));
                        }}/>
                    </div>


                </div>
            </div>
        }/>
    );
}
