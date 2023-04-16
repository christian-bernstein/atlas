import React from "react";
import {Screen} from "../base/components/base/Page";
import {Workspace} from "./Workspace";
import {ProjectHeaderView} from "./ProjectHeaderView";
import {ProjectView} from "./ProjectView";
import {MetadataView} from "./MetadataView";

export const MobileProjectWorkspaceLayout: React.FC = props => {

    return (
        <Screen style={{ backgroundColor: "#1a1a20" }} children={
            <div style={{
                display: "grid",
                height: "100%",
                gridTemplateRows: "min-content auto min-content",
                rowGap: "8px"
            }}>
                <Workspace children={<ProjectHeaderView/>} config={{
                    mode: "mobile",
                    name: "project-title"
                }}/>

                <Workspace children={<ProjectView/>} config={{
                    mode: "mobile",
                    name: "project"
                }}/>

                <Workspace children={<MetadataView/>} config={{
                    mode: "mobile",
                    name: "project-metadata"
                }}/>
            </div>
        }/>
    );
}
