import React from "react";
import {LayoutState} from "../LayoutState";
import {Tray} from "./Tray";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";

export type LayoutManagerViewProps = {
    layout: LayoutState,
    trayRenderers: Map<string, () => React.ReactNode>
}

export const LayoutManagerView: React.FC<LayoutManagerViewProps> = props => {

    const render = (key: string) => {
        const program = props.layout.occupancy.get(key);
        if (program !== undefined) return props.trayRenderers.get(program)?.() ?? "No renderer found"
        const emptyProgram = `_empty:${key}`;
        let ePRender = props.trayRenderers.get(emptyProgram);
        if (ePRender !== undefined) return ePRender();
        return props.trayRenderers.get("_empty")?.() ?? undefined;
    };

    const isOpen = (key: string) => {
        return props.layout.trayOpenStates.get(key) ?? true
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateRows: "auto min-content",
            // TODO: Maybe fixed calc() sizes
            width: "100%",
            height: "100%",
            // gap: "8px"
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "min-content auto min-content",
                // gap: "8px"
            }}>
                {
                    (isOpen("left") && (
                        <Tray children={render("left")} style={{
                            marginRight: "8px"
                        }} config={{
                            name: "left",
                            resizable: true
                        }}/>
                    )) || <span/>
                }

                {/*
                <TransitionGroup style={{ height: "100%" }} children={
                    isOpen("left") && (
                        <Collapse sx={{ height: "100%", width: "300px" }} orientation={"horizontal"} children={
                            <Tray children={render("left")} config={{
                                name: "left",
                                // resizable: true
                            }}/>
                        }/>
                    )
                }/>
                */}

                <Tray children={render("main")} config={{
                    name: "main"
                }}/>

                {/*
                <TransitionGroup style={{ height: "100%" }} children={
                    isOpen("right") && (
                        <Collapse sx={{ height: "100%", width: "300px" }} orientation={"horizontal"} children={
                            <Tray children={render("right")} config={{
                                name: "right",
                                // resizable: true,
                                // resizablePropertyOverrides: {
                                //     width: 300,
                                //     axis: "x",
                                //     resizeHandles: ["w"]
                                // }
                            }}/>
                        }/>
                    )
                }/>
                */}

                {
                    (isOpen("right") && (
                        <Tray children={render("right")} style={{
                            marginLeft: "8px"
                        }} config={{
                            name: "right",
                            resizable: true,
                            resizablePropertyOverrides: {
                                width: 300,
                                axis: "x",
                                resizeHandles: ["w"]
                            }
                        }}/>
                    )) || <span/>
                }
            </div>

            <TransitionGroup children={
                isOpen("bottom") && (
                    <Collapse children={
                        <Tray children={render("bottom")} config={{
                            name: "bottom",
                            resizable: true,
                            growOrientation: "vertical"
                        }}/>
                    }/>
                )
            }/>
        </div>
    );
}
