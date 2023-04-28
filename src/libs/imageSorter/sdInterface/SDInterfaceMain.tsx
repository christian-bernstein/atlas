import React, {PropsWithChildren, useContext, useRef, useState} from "react";
import {SDInterfaceState} from "./SDInterfaceState";
import {SDInterfaceAPI, SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceMaster} from "./SDInterfaceMaster";
import {Mobile} from "../../base/components/logic/Media";
import {SDAPIRequestData} from "../SDAPIRequestData";
import _ from "lodash";
import {ImageSorterAPI, ImageSorterAPIContext} from "../ImageSorterAPI";
import {useAutoSettings} from "../SettingsHook";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";

function generateSDInterfaceState(api?: ImageSorterAPI): SDInterfaceState {
    if (api === undefined) return {
        phase: "default",
        activeTab: "main",
        debouncedRequestSaver: () => console.error("Uninitialized SD interface (main api was missing during state generation)")
    }

    return {
        phase: "default",
        activeTab: "main",
        debouncedRequestSaver: _.debounce((req: SDAPIRequestData) => {
            api.settingsManager.updateSettingsObject("SDAPIRequestData", () => req).then(() => {});
        }, 2e3)
    };
}

export type SDInterfaceMainProps = PropsWithChildren<{
    mobile?: React.ReactNode
}>

export const SDInterfaceMain: React.FC<SDInterfaceMainProps> = props => {
    const api = useContext(ImageSorterAPIContext);
    const [state, setState] = useState<SDInterfaceState>(generateSDInterfaceState(api));

    console.log("[main] state:", state, "state dispatcher available:", setState !== undefined)

    const sdApi = useRef(new SDInterfaceAPI(state, setState));
    sdApi.current.updateState(state);

    // Initial state -> Retrieved from the local database
    const initialRequestData = useAutoSettings<SDAPIRequestData>("SDAPIRequestData", {
        prompt: "",
        negativePrompt: ""
    });

    // Local updates -> Get mixed in to the database mirror
    const deltaRequestData = useRef<SDAPIRequestData>({
        prompt: "",
        negativePrompt: ""
    });

    return (
        <SDInterfaceRequestContext.Provider value={{
            initialRequestData: initialRequestData,
            deltaRequestData: deltaRequestData.current
        }} children={
            <SDInterfaceStateContext.Provider value={state} children={
                <SDInterfaceMaster children={
                    <SDInterfaceAPIContext.Provider value={sdApi.current} children={
                        props.mobile === undefined ? (
                            <>
                                { <DescriptiveTypography text={`Active tab: '${state.activeTab}'`}/> }
                                { props.children }
                            </>
                            ) : (
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

export const SDInterfaceStateContext = React.createContext<SDInterfaceState>(generateSDInterfaceState());

export type SDInterfaceRequestContextData = {
    initialRequestData: SDAPIRequestData | undefined,
    deltaRequestData: SDAPIRequestData | undefined
}

export const SDInterfaceRequestContext = React.createContext<SDInterfaceRequestContextData | undefined>(undefined);
