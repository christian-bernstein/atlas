import React, {PropsWithChildren, useRef, useState} from "react";
import {SDInterfaceState} from "./SDInterfaceState";
import {SDInterfaceAPI, SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceMaster} from "./SDInterfaceMaster";
import {Mobile} from "../../base/components/logic/Media";

function generateSDInterfaceState(): SDInterfaceState {
    return {
    };
}

export type SDInterfaceMainProps = PropsWithChildren<{
    mobile?: React.ReactNode
}>

export const SDInterfaceMain: React.FC<SDInterfaceMainProps> = props => {
    const [state, setState] = useState<SDInterfaceState>(generateSDInterfaceState());
    const api = useRef(new SDInterfaceAPI(state, setState));
    api.current.updateState(state);

    return (
        <SDInterfaceStateContext.Provider value={state} children={
            <SDInterfaceMaster children={
                <SDInterfaceAPIContext.Provider value={api.current} children={
                    props.mobile === undefined ? (props.children) : (
                        <>
                            {/* Render mobile layout */}
                            <Mobile children={props.mobile}/>

                            {/* Render default layout */}
                            <Mobile children={props.children}/>
                        </>
                    )
                }/>
            }/>
        }/>
    );
}

export const SDInterfaceStateContext = React.createContext<SDInterfaceState>(generateSDInterfaceState());