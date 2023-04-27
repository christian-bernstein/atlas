import React, {PropsWithChildren, useContext} from "react";
import {SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceStateContext} from "./SDInterfaceMain";

export const SDInterfaceMaster: React.FC<PropsWithChildren> = props => {
    const sdApi = useContext(SDInterfaceAPIContext);
    const sdState = useContext(SDInterfaceStateContext);
    sdApi.updateState(sdState);

    return (
        <>{ props.children }</>
    );
}