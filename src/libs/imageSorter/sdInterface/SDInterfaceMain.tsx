import React, {PropsWithChildren, useContext, useRef, useState} from "react";
import {SDInterfaceState} from "./SDInterfaceState";
import {SDInterfaceAPI, SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceMaster} from "./SDInterfaceMaster";
import {Mobile} from "../../base/components/logic/Media";
import {SDAPIRequestData} from "./SDAPIRequestData";
import _ from "lodash";
import {ImageSorterAPIContext} from "../ImageSorterAPI";
import {useAutoSettings} from "../SettingsHook";

export type SDInterfaceMainProps = PropsWithChildren<{
    mobile?: React.ReactNode
}>

export const SDInterfaceMain: React.FC<SDInterfaceMainProps> = props => {
    const api = useContext(ImageSorterAPIContext);

    // Initial state -> Retrieved from the local database
    const initialRequestData = useAutoSettings<SDAPIRequestData>("SDAPIRequestData", {
        prompt: "",
        negativePrompt: ""
    });

    // Local updates -> Get mixed in to the database mirror
    const deltaRequestData: React.MutableRefObject<SDAPIRequestData> = useRef<SDAPIRequestData>({
        prompt: "",
        negativePrompt: ""
    });

    const [state, setState] = useState<SDInterfaceState>({
        phase: "default",
        activeTab: "main",
        debouncedRequestSaver: _.debounce((req: SDAPIRequestData) => {
            api.settingsManager.updateSettingsObject("SDAPIRequestData", () => req).then(() => {});
        }, 1e3),
        updateRequest: delta => {
            const newRequest: SDAPIRequestData = { ...deltaRequestData.current, ...delta };
            deltaRequestData.current = newRequest;
            state.debouncedRequestSaver(newRequest);
        }
    });

    const sdApiData = useRef<{
        sdApi: SDInterfaceAPI
    }>({
        sdApi: new SDInterfaceAPI(state, setState, {
            initialRequestData: initialRequestData,
            deltaRequestData: deltaRequestData.current
        })
    });

    sdApiData.current.sdApi.updateState(state);
    sdApiData.current.sdApi.updateRequestContextData({
        initialRequestData: initialRequestData,
        deltaRequestData: deltaRequestData.current
    });

    return (
        <SDInterfaceRequestContext.Provider value={{
            initialRequestData: initialRequestData,
            deltaRequestData: deltaRequestData.current
        }} children={
            <SDInterfaceStateContext.Provider value={state} children={
                <SDInterfaceMaster children={
                    <SDInterfaceAPIContext.Provider value={sdApiData.current.sdApi} children={
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
        }/>
    );
}

export const SDInterfaceStateContext = React.createContext<SDInterfaceState>({
    phase: "default",
    activeTab: "main",
    debouncedRequestSaver: () => console.error("Uninitialized SD interface (main api was missing during state generation)")
});

export type SDInterfaceRequestContextData = {
    initialRequestData: SDAPIRequestData | undefined,
    deltaRequestData: SDAPIRequestData | undefined
}

export const SDInterfaceRequestContext = React.createContext<SDInterfaceRequestContextData | undefined>(undefined);
