import React, {CSSProperties, PropsWithChildren} from "react";
import {ResizableBox} from "react-resizable";
import {TrayConfig} from "./TrayConfig";

export type TrayProps = PropsWithChildren<{
    config: TrayConfig,
    style?: CSSProperties
}>

export const Tray: React.FC<TrayProps> = props => {
    const resizable = props.config.resizable ?? false;
    const go = props.config.growOrientation ?? "horizontal";

    if (resizable) {
        if (go === "vertical") {
            return (
                <ResizableBox
                    resizeHandles={["n"]}
                    {...props.config.resizablePropertyOverrides}
                    className={"box"}
                    height={350}
                    axis={"y"}
                    style={{
                        ...props.style,
                        borderRadius: ".5rem",
                        overflow: "hidden",
                        height: "100% !important",
                    }}
                    handle={(h, ref) => (
                        <span
                            className={`react-resizable-handle react-resizable-handle-${h}`}
                            ref={ref}
                            style={{
                                backgroundColor: "transparent",
                                height: 5,
                                top: 0,
                                left: 0,
                                margin: 0,
                                transformOrigin: 0,
                                transform: "none",
                                width: "100%"
                            }}
                        />
                    )}
                    minConstraints={[0, 200]}
                    maxConstraints={[0, 600]}
                    children={
                        <div style={{
                            // height: "100%",
                            width: "100%",
                            // backgroundColor: "crimson",
                            borderRadius: ".5rem",
                            // padding: "1rem",
                            overflow: "scroll"
                        }} children={props.children}/>
                    }
                />
            );
        }

        return (
            <ResizableBox
                resizeHandles={["e"]}
                {...props.config.resizablePropertyOverrides}
                className={"box"}
                width={350}
                axis={"x"}
                style={{
                    ...props.style,
                    // height: "100%",
                    height: "100% !important",
                    borderRadius: ".5rem",
                    overflow: "hidden"
                }}
                handle={(h, ref) => (
                    <span
                        className={`react-resizable-handle react-resizable-handle-${h}`}
                        ref={ref}
                        style={{
                            backgroundColor: "transparent",
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
                        borderRadius: ".5rem",
                        // backgroundColor: "crimson",
                        overflow: "scroll",
                        // padding: "1rem",
                        width: "100%"
                    }} children={props.children}/>
                }
            />
        );
    }

    return (
        <TrayContext.Provider value={props.config}>
            <div style={{
                ...props.style,
                height: "100%",
                width: "100%",
                overflow: "scroll",
                // backgroundColor: "#101016",
                // backgroundColor: "crimson",
                borderRadius: ".5rem",
                // padding: "1rem",
            }} children={props.children}/>
        </TrayContext.Provider>
    );
}

export const TrayContext = React.createContext<TrayConfig>({
    name: "n/a",
});
