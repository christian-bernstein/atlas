import React, {CSSProperties, PropsWithChildren} from "react";
import {WorkspaceConfig} from "./WorkspaceConfig";
import {ResizableBox} from "react-resizable";

export type WorkspaceProps = PropsWithChildren<{
    config: WorkspaceConfig,
    style?: CSSProperties
}>

export const Workspace: React.FC<WorkspaceProps> = props => {
    const resizable = props.config.resizable ?? false;

    if (resizable) {
        return (
            <ResizableBox
                resizeHandles={["e"]}
                {...props.config.resizablePropertyOverrides}
                className={"box"}
                width={350}
                axis={"x"}
                style={{
                    borderRadius: ".5rem",
                    overflow: "hidden",
                    ...props.style
                }}
                handle={(h, ref) => (
                    <span
                        className={`react-resizable-handle react-resizable-handle-${h}`}
                        ref={ref}
                        style={{
                            backgroundColor: "rgba(200, 200, 200, .16)",
                            height: "100%",
                            top: 0,
                            margin: 0,
                            transformOrigin: 0,
                            transform: "none",
                            width: 5
                        }}
                    />
                )}
                minConstraints={[200, 0]}
                maxConstraints={[600, 0]}
                children={
                    <div style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#101016",
                        borderRadius: ".5rem",
                        padding: "1rem",
                        overflow: "scroll"
                    }} children={props.children}/>
                }
            />
        );
    }

    return (
        <WorkspaceContext.Provider value={props.config}>
            <div style={{
                height: "100%",
                width: "100%",
                overflow: "scroll",
                backgroundColor: "#101016",
                borderRadius: ".5rem",
                padding: "1rem",
                ...props.style
            }} children={props.children}/>
        </WorkspaceContext.Provider>
    );
}

export const WorkspaceContext = React.createContext<WorkspaceConfig>({
    name: "n/a",
    mode: "desktop"
});
