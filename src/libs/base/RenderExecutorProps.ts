import {RenderBridge} from "./RenderBridge";
import {PropsWithChildren} from "react";

export type RenderExecutorProps = PropsWithChildren<{
    renderChildren?: boolean,
    componentFactory: () => JSX.Element,
    channels?: string[],
    upstreamOnComponentUnmountHandler?: (id: string) => void,
    id: string
    componentDidMountRelay: (bridge: RenderBridge) => void;
}>
