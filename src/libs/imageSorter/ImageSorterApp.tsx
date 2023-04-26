import React, {PropsWithChildren, useContext, useRef, useState} from "react";
import {Project} from "./Project";
import {VFSView} from "./VFSView";
import {ProjectView} from "./ProjectView";
import {ImageView} from "./ImageView";
import {Default, Mobile} from "../base/components/logic/Media";
import {Workspace} from "./Workspace";
import {ImageSorterAPI, ImageSorterAPIContext} from "./ImageSorterAPI";
import {AppHeader} from "./AppHeader";
import 'react-tooltip/dist/react-tooltip.css'
import {VFSViewOptions} from "./VFSViewOptions";
import {ProjectHeaderView} from "./ProjectHeaderView";
import {MetadataView} from "./MetadataView";
import {SelectionView} from "./SelectionView";
import {ScreenSaver} from "./ScreenSaver";
import {LayoutManagerView} from "./layout/LayoutManagerView";
import {SidePanel} from "./SidePanel";
import {LayoutTabButton} from "./LayoutTabButton";
import {
    ApiRounded,
    CodeRounded,
    FolderRounded,
    HttpRounded,
    ImageRounded,
    ImageSearchRounded,
    StyleRounded
} from "@mui/icons-material";
import {BottomPanel} from "./BottomPanel";
import {MobileMainView} from "./mobile/MobileMainView";
import {StyleLibraryView} from "./StyleLibraryView";
import {StyleDataDisplay} from "./StyleDataDisplay";
import {IconButton} from "./IconButton";
import {ButtonModalCompound} from "./ButtonModalCompound";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {SDRequestDialog} from "./SDRequestDialog";

export type ImageSorterAppState = {
    fvsPath: Array<string>,
    projects: Array<Project>,
    isProjectCreationDialogOpened: boolean,
    isFolderCreationDialogOpened: boolean,
    selectedProject?: string,
    selectedImageId?: string,
    selectedImages: Array<string>,
    selectionMode: boolean,
    selectionPreview: boolean,
    openedTrays: Array<string>,
    trayOccupancy: {[K in string | "left" | "main" | "right" | "bottom"]: string | undefined},
    selectedStyleId?: string
}

function generateAppState(): ImageSorterAppState {
    return ({
        isProjectCreationDialogOpened: false,
        isFolderCreationDialogOpened: false,
        selectedImages: [],
        projects: [],
        fvsPath: [],
        selectionMode: false,
        selectionPreview: true,
        openedTrays: ["left", "main", "right"],
        trayOccupancy: {
            left: "vfs-view",
            main: "image-view",
            right: "project-view",
            bottom: "delta",
        }
    });
}

export const ImageSorterApp: React.FC = props => {
    const [state, setState] = useState<ImageSorterAppState>(generateAppState());
    const api = useRef(new ImageSorterAPI(state, setState));
    api.current.updateState(state);

    return (
        <ImageSorterAPIStateContext.Provider value={state} children={
            <ImageSorterMaster children={
                <ImageSorterAPIContext.Provider value={api.current}>
                    <Mobile children={
                        <MobileMainView/>
                    }/>

                    <Default children={
                        <div style={{
                            display: "grid",
                            rowGap: "1rem",
                            // padding: "1rem",
                            padding: "8px",
                            gridAutoRows: "min-content auto",
                            width: "calc(100vw + 0px)",
                            height: "calc(100vh - 0.3rem)",
                            maxHeight: "calc(100vh - 0.3rem)",
                            overflow: "hidden"

                        }}>
                            <ScreenSaver/>
                            <AppHeader/>

                            <div style={{
                                display: "grid",
                                gap: "8px",
                                gridTemplateColumns: "min-content auto min-content",
                                height: "calc(100% - 0.3rem)",
                                maxHeight: "calc(100% - 0.3rem)",
                                width: "100%",
                                overflow: "scroll"
                            }}>
                                <SidePanel start={
                                    <>
                                        <LayoutTabButton targetTray={"left"} programKey={"vfs-view"} children={<FolderRounded/>}/>
                                        <LayoutTabButton targetTray={"left"} programKey={"style-view"} children={<StyleRounded/>}/>
                                    </>
                                } end={
                                    <>
                                        <LayoutTabButton targetTray={"bottom"} programKey={"gamma"} children={<CodeRounded/>}/>
                                    </>
                                }/>

                                <LayoutManagerView
                                    layout={{
                                        trayOpenStates: new Map<string, boolean>(["left", "main", "right", "bottom"].map(tray => [tray, state.openedTrays.includes(tray)])),
                                        occupancy: new Map<string, string | undefined>(Object.entries(state.trayOccupancy))
                                    }}
                                    trayRenderers={new Map<string, () => React.ReactNode>([
                                        ["vfs-view", () => (
                                            <div style={{
                                                display: "grid",
                                                height: "100%",
                                                gridTemplateRows: "min-content auto",
                                                rowGap: "8px"
                                            }}>
                                                <Workspace children={<VFSViewOptions/>} config={{
                                                    mode: "desktop",
                                                    name: "vfs-options"
                                                }}/>

                                                <Workspace children={<VFSView/>} config={{
                                                    mode: "desktop",
                                                    name: "vfs"
                                                }}/>
                                            </div>
                                        )],

                                        ["style-view", () => (
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                rowGap: "8px",
                                                height: "calc(100% - 0px)"
                                            }}>
                                                <Workspace children={<StyleLibraryView/>} config={{
                                                    mode: "desktop",
                                                    name: "style-library"
                                                }}/>

                                                <Workspace style={{
                                                    flexShrink: 0,
                                                    height: "min-content"
                                                }} children={<StyleDataDisplay/>} config={{
                                                    mode: "desktop",
                                                    name: "project-metadata"
                                                }}/>
                                            </div>
                                        )],

                                        ["image-view", () => (
                                            <div style={{
                                                display: "grid",
                                                height: "100%",
                                                gridTemplateRows: "auto min-content"
                                            }}>
                                                <ImageView/>

                                                <SelectionView/>
                                            </div>
                                        )],

                                        ["project-view", () => (
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                rowGap: "8px",
                                                height: "calc(100% - 0px)"
                                            }}>
                                                <Workspace style={{
                                                    flexShrink: 0,
                                                    height: "min-content"
                                                }} children={<ProjectHeaderView/>} config={{
                                                    mode: "desktop",
                                                    name: "project-title"
                                                }}/>

                                                <Workspace style={{
                                                    flexShrink: 2
                                                }} children={<ProjectView/>} config={{
                                                    mode: "desktop",
                                                    name: "project"
                                                }}/>

                                                <Workspace style={{
                                                    flexShrink: 0,
                                                    height: "min-content"
                                                }} children={<MetadataView/>} config={{
                                                    mode: "desktop",
                                                    name: "project-metadata"
                                                }}/>
                                            </div>
                                        )]
                                    ])}
                                />

                                <SidePanel start={
                                    <>
                                        <LayoutTabButton targetTray={"right"} programKey={"project-view"} children={<ImageRounded/>}/>
                                    </>
                                } end={
                                    <>
                                        <ButtonModalCompound button={<IconButton size={"small"} children={<ApiRounded/>}/>} modalContent={ctx => (
                                            <SDRequestDialog bus={new DuplexEventRelay()} onClose={() => ctx.close()}/>
                                        )}/>
                                    </>
                                }/>
                            </div>

                            {/*
                            <BottomPanel/>
                            */}
                        </div>
                    }/>
                </ImageSorterAPIContext.Provider>
            }/>
        }/>
    );
}

export const ImageSorterAPIStateContext = React.createContext<ImageSorterAppState>(generateAppState())

export const ImageSorterMaster: React.FC<PropsWithChildren> = (props) => {
    const api = useContext(ImageSorterAPIContext);
    const state = useContext(ImageSorterAPIStateContext);
    api.updateState(state);
    return (
        <>{ props.children }</>
    );
};
