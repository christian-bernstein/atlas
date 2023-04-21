import React, {PropsWithChildren, useContext} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {IconButton} from "./IconButton";

export type LayoutTabButtonProps = PropsWithChildren<{
    programKey: string,
    targetTray: string
}>

export const LayoutTabButton: React.FC<LayoutTabButtonProps> = props => {
    const api = useContext(ImageSorterAPIContext);
    const tray = Object.entries(api.state.trayOccupancy).find(([k, v]) => v === props.programKey);
    const isOpened = tray !== undefined;

    return (
        <IconButton
            tooltipPlace={"right"}
            // TODO: Display title + Opening shortcut
            // tooltip={"Test"}
            size={"small"}
            children={props.children}
            variant={isOpened ? "primary" : "default"}
            onClick={() => {

            if (isOpened) {
                api.setState(prevState => ({
                    ...prevState,
                    trayOccupancy: {
                        ...prevState.trayOccupancy,
                        [tray[0]]: undefined
                    },
                    openedTrays: prevState.openedTrays.filter(s => s !== tray[0])
                }))
            } else {
                api.setState(prevState => ({
                    ...prevState,
                    trayOccupancy: {
                        ...prevState.trayOccupancy,
                        // TODO: Set default / previous tray
                        [props.targetTray]: props.programKey,
                    },
                    openedTrays: [props.targetTray, ...prevState.openedTrays]
                }));
            }
        }}/>
    );
}
