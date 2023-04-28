import React from "react";
import {Workspace} from "../Workspace";

export const MixinTab: React.FC = props => {

    return (
        <div style={{
            width: "100%",
            height :"100%",
            backgroundColor: "crimson",
            display: "grid",
            gap: "8px",
            gridTemplateColumns: "min-content auto"
        }}>
            <div style={{
                width: "100%",
                height :"100%",
                backgroundColor: "darkgreen",
                display: "grid",
                gap: "8px",
                gridTemplateRows: "min-content auto"
            }}>
                <Workspace config={{
                    mode: "desktop",
                    name: "mixin-selector-toolbar",
                }}/>
                <Workspace config={{
                    mode: "desktop",
                    name: "mixin-selector",
                    resizable: true
                }}/>
            </div>



            <Workspace config={{
                mode: "desktop",
                name: "mixin-view"
            }}/>
        </div>
    );
}
