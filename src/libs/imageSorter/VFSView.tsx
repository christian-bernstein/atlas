import React, {useContext, useEffect, useState} from "react";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {VFSFolderContentViewer} from "./VFSFolderContentViewer";
import {
    ArrowLeftRounded,
    CheckRounded,
    CreateNewFolderRounded, CreateRounded,
    DownloadRounded,
    FullscreenRounded,
    MoreVertRounded, UploadRounded
} from "@mui/icons-material";
import {VFSElement} from "./VFSElement";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {IconButton} from "./IconButton";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {ButtonGroup} from "./ButtonGroup";
import {CheckMenuButton, MenuButton} from "./MenuButton";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {Menu} from "./Menu";
import {MenuDivider} from "@szhsin/react-menu";
import {VFSViewSettings} from "./VFSViewSettings";
import {useAutoSettings, useSettings} from "./SettingsHook";
import {FileStructureImportModal} from "./FileStructureImportModal";
import {BooleanContext} from "../test/BooleanContext";

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

    const settings = useAutoSettings<VFSViewSettings>("VFSViewSettings") ?? {
        defaultPreview: false
    };

    return (
        <VFSViewSettingsContext.Provider value={settings} children={
            <div style={{
                display: "grid",
                gridTemplateRows: "min-content auto",
                gap: "8px",
                height: "100%",
                borderRadius: ".5rem",
            }}>
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

                    <Menu opener={<IconButton size={"small"} children={<MoreVertRounded/>}/>}>
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
                </div>
                <VFSFolderContentViewer/>
            </div>
        }/>
    );
}

export const VFSViewSettingsContext = React.createContext<VFSViewSettings>({
    defaultPreview: false
});
