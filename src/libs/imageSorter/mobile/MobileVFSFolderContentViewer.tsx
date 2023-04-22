import React, {useContext} from "react";
import {ImageSorterAPIContext} from "../ImageSorterAPI";
import {ImageSorterAPIStateContext} from "../ImageSorterApp";
import {WorkspaceContext} from "../Workspace";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "../ImageSorterAppDB";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {VFSElementCard} from "../VFSElementCard";
import {HOCWrapper} from "../../base/components/HOCWrapper";
import {MobileProjectWorkspaceLayout} from "../MobileProjectWorkspaceLayout";
import {MobileVFSFolderElementCard} from "./MobileVFSFolderElementCard";

export const MobileVFSFolderContentViewer: React.FC = props => {
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
            overflow: "hidden",
            maxWidth: "calc(100% - 0px)",
            width: "100%"
        }}>
            <DescriptiveTypography text={"Folders"}/>
            <div style={{
                display: "flex",
                overflowX: "scroll",
                width: "100%",
                maxWidth: "calc(100% - 0px)",
                gap: "8px",
                height: "calc(100px / 1.5)"
            }}>{
                folders.map(e => (
                    <MobileVFSFolderElementCard key={e.id} for={e} onSelect={() => {
                        api.appendToFilePath(e.id);
                    }}/>
                ))
            }</div>

            <DescriptiveTypography text={"Projects"}/>

            <HOCWrapper body={wrapper => (
                <div style={{
                    display: "flex",
                    overflowX: "scroll",
                    width: "100%",
                    maxWidth: "calc(100% - 0px)",
                    gap: "8px",
                    height: "min-content"
                }}>{
                    projects.map(e => (
                        <VFSElementCard key={e.id} for={e} onSelect={() => {
                            api.selectProject(e.id);

                            // if (workspace.mode === "mobile") {
                            //     // Open the mobile dialog-based project view
                            //     wrapper.dialog(
                            //         <MobileProjectWorkspaceLayout/>
                            //     );
                            // }
                        }}/>
                    ))
                }</div>
            )}/>
        </div>
    );
}
