import {ResizableBoxProps} from "react-resizable";

export type WorkspaceConfig = {
    name: string,
    mode: "mobile" | "desktop",
    resizable?: boolean,
    resizablePropertyOverrides?: ResizableBoxProps
}
