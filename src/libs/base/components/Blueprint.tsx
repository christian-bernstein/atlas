import React, {PropsWithChildren} from "react";
import {Screen} from "./base/Page";

export type BlueprintProps = PropsWithChildren<{
    blueprint: JSX.Element,
    opacity?: number
}>

export const Blueprint: React.FC<BlueprintProps> = props => {
    return (
        <Screen deactivatePadding style={{ backgroundColor: "black", position: "relative" }} children={<>
            <span style={{
                position: "absolute",
                zIndex: 2,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: props.opacity ?? .5
            }} children={props.children}/>
            {props.blueprint}
        </>}/>
    );
}
