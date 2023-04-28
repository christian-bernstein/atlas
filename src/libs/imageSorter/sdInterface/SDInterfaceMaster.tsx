import React, {PropsWithChildren, useContext} from "react";
import {SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceRequestContext, SDInterfaceStateContext} from "./SDInterfaceMain";

export const SDInterfaceMaster: React.FC<PropsWithChildren> = props => {
    const sdApi = useContext(SDInterfaceAPIContext);
    const sdState = useContext(SDInterfaceStateContext);
    const rcd = useContext(SDInterfaceRequestContext)!;
    console.log("[master] updating api references", sdApi, sdState, "RCD", rcd)
    sdApi.updateState(sdState);
    sdApi.updateRequestContextData(rcd);
    console.log("[master] updated api", sdApi)

    return (
        <>{ props.children }</>
    );
}
