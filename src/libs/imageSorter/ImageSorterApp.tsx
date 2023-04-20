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
                        <div style={{
                            display: "grid",
                            rowGap: "1rem",
                            padding: "1rem",
                            gridAutoRows: "min-content auto",
                            width: "calc(100vw + 0px)",
                            height: "calc(100vh - 0.3rem)"
                        }}>
                            <AppHeader/>
                            <div style={{
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                display: "grid",
                                // gridTemplateColumns: "min-content auto min-content",
                                gap: "8px"
                            }}>
                                <div style={{
                                    display: "grid",
                                    gridTemplateRows: "min-content auto",
                                    rowGap: "8px"
                                }}>
                                    <Workspace children={<VFSViewOptions/>} config={{
                                        mode: "mobile",
                                        name: "vfs-options",
                                    }}/>

                                    <Workspace children={<VFSView/>} config={{
                                        mode: "mobile",
                                        name: "vfs"
                                    }}/>
                                </div>
                            </div>
                        </div>
                    }/>

                    <LayoutManagerView
                        layout={{
                            occupancy: new Map<string, string | undefined>([
                                ["left", "alpha"],
                                ["main", "beta"],
                                ["right", "gamma"],
                                ["bottom", "delta"],
                            ]),
                            trayOpenStates: new Map<string, boolean>([
                                ["left", true],
                                ["main", true],
                                ["right", true],
                                ["bottom", true],
                            ])
                        }}
                        trayRenderers={new Map<string, () => React.ReactNode>([
                            ["alpha", () => "Alpha"],
                            ["beta", () => "Beta"],
                            ["gamma", () => "gamma"],
                            ["delta", () => "Delta"],
                            ["theta", () => "Theta"],
                            ["phy", () => "Phy"],
                            ["omega", () => "Omega"],
                            ["_empty", () => "EMPTY"],
                        ])}
                    />

                    {/*
                    <Default children={
                        <div style={{
                            display: "grid",
                            rowGap: "1rem",
                            padding: "1rem",
                            gridAutoRows: "min-content auto",
                            width: "calc(100vw + 0px)",
                            height: "calc(100vh - 0.3rem)"
                        }}>
                            <ScreenSaver/>


                            <AppHeader/>
                            <div style={{
                                width: "100%",
                                height: "100%",
                                maxHeight: "100%",
                                overflow: "scroll",
                                display: "grid",
                                gridTemplateColumns: "min-content auto min-content",
                                gridTemplateRows: "100%",
                                gap: "8px"
                            }}>
                                <div style={{
                                    display: "grid",
                                    gridTemplateRows: "min-content auto",
                                    rowGap: "8px"
                                }}>
                                    <Workspace children={<VFSViewOptions/>} config={{
                                        mode: "desktop",
                                        name: "vfs-options",
                                    }}/>

                                    <Workspace children={<VFSView/>} config={{
                                        mode: "desktop",
                                        name: "vfs",
                                        resizable: true,
                                        resizablePropertyOverrides: {
                                            width: 300,
                                            axis: "x",
                                            resizeHandles: ["e"]
                                        }
                                    }}/>
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateRows: "auto min-content",
                                    // rowGap: "8px"
                                }}>
                                    <ImageView/>

                                    <SelectionView/>
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateRows: "min-content auto min-content",
                                    rowGap: "8px"
                                }}>
                                    <Workspace children={<ProjectHeaderView/>} config={{
                                        mode: "desktop",
                                        name: "project-title"
                                    }}/>

                                    <Workspace children={<ProjectView/>} config={{
                                        mode: "desktop",
                                        name: "project",
                                        resizable: true,
                                        resizablePropertyOverrides: {
                                            width: 300,
                                            axis: "x",
                                            resizeHandles: ["w"]
                                        }
                                    }}/>

                                    <Workspace children={<MetadataView/>} config={{
                                        mode: "desktop",
                                        name: "project-metadata"
                                    }}/>
                                </div>

                            </div>
                        </div>
                    }/>
                    */}
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
