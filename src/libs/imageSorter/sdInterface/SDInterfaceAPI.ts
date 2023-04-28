import {StateDispatcher} from "../../ship/test/core/StateDispatcher";
import {SDInterfaceState} from "./SDInterfaceState";
import React from "react";
import axios from "axios";
import {SDInterfaceRequestContextData} from "./SDInterfaceMain";
import {SDAPIRequestData} from "../SDAPIRequestData";

export class SDInterfaceAPI {

    private _state: SDInterfaceState | undefined;

    private readonly _setState: StateDispatcher<SDInterfaceState> | undefined;

    private _requestContextData: SDInterfaceRequestContextData | undefined;

    constructor(state?: SDInterfaceState, setState?: StateDispatcher<SDInterfaceState>) {
        this._state = state;
        this._setState = setState;

        console.log("[sd api] state:", state, "state dispatcher availability:", setState !== undefined);
    }

    public updateState(state: SDInterfaceState) {
        console.log("[sd api] updating state reference", state)
        this._state = state;
    }

    public updateRequestContextData(rcd: SDInterfaceRequestContextData) {
        this._requestContextData = rcd;
    }

    public updateRequestData(delta: Partial<SDAPIRequestData>) {
        const newRequest: SDAPIRequestData = { ...this._requestContextData!.deltaRequestData!, ...delta };

        // Maybe add context function to do it!
        // deltaRequestData.current = newRequest;
        this.state.debouncedRequestSaver(newRequest);
    }

    public interruptImageGeneration() {
        axios.post("http://127.0.0.1:7860/sdapi/v1/interrupt").then(res => {
            this.setState(prevState => ({
                ...prevState,
                phase: "default",
                resultImage: res.data,
                previewImage: undefined
            }));
        });
    }

    get setState(): StateDispatcher<SDInterfaceState> {
        return this._setState!;
    }

    get state(): SDInterfaceState {
        return this._state!;
    }

    get requestContextData(): SDInterfaceRequestContextData {
        return this._requestContextData!;
    }
}

export const SDInterfaceAPIContext = React.createContext<SDInterfaceAPI>(new SDInterfaceAPI())
