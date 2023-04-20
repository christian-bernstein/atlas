import {ResizableBoxProps} from "react-resizable";

export type TrayConfig = {
    name: string,
    resizable?: boolean,
    resizablePropertyOverrides?: ResizableBoxProps,
    growOrientation?: "horizontal" | "vertical"
}
