import {isaDB} from "./ImageSorterAppDB";
import {useContext} from "react";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {useLiveQuery} from "dexie-react-hooks";
import {VFSElementCard} from "./VFSElementCard";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {Workspace, WorkspaceContext} from "./Workspace";
import {HOCWrapper} from "../base/components/HOCWrapper";
import {ProjectView} from "./ProjectView";
import {Screen} from "../base/components/base/Page";
import {MobileProjectWorkspaceLayout} from "./MobileProjectWorkspaceLayout";

export function VFSFolderContentViewer() {
    const api = useContext(ImageSorterAPIContext);
    const state = useContext(ImageSorterAPIStateContext);
    const workspace = useContext(WorkspaceContext);

    const elements = useLiveQuery(async () => {
        const currentFolder = await api.getCurrentElement();
        return isaDB.vfsElements
            .where("path")
            .equals(api.getElementPath(currentFolder!))
            .toArray();
    }, [state.fvsPath]);

    if (elements === undefined) {
        return (
            <></>
        );
    }

    const folders = elements.filter(e => e.type === "folder");
    const projects = elements.filter(e => e.type === "project");

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
        }}>
            <DescriptiveTypography text={"Folders"}/>
            <div style={{
                display: "grid",
                gap: "8px",
                // gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateColumns: "repeat(auto-fill, minmax(64px, auto))",
                height: "min-content"
            }}>{
                folders.map(e => (
                    <VFSElementCard key={e.id} for={e} onSelect={() => {
                        api.appendToFilePath(e.id);
                    }}/>
                ))
            }</div>

            <DescriptiveTypography text={"Projects"}/>

            <HOCWrapper body={wrapper => (
                <div style={{
                    display: "grid",
                    gap: "8px",
                    // gridTemplateColumns: "repeat(3, 1fr)",
                    // gridTemplateColumns: "repeat(auto-fill, minmax(64px, auto))",
                    gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))",
                    height: "min-content"
                }}>{
                    projects.map(e => (
                        <VFSElementCard key={e.id} for={e} onSelect={() => {
                            api.selectProject(e.id);

                            if (workspace.mode === "mobile") {
                                // Open the mobile dialog-based project view
                                wrapper.dialog(
                                    <MobileProjectWorkspaceLayout/>
                                );
                            }
                        }}/>
                    ))
                }</div>
            )}/>
        </div>
    );
}
