import {StateDispatcher} from "../../ship/test/core/StateDispatcher";
import {SDInterfaceState} from "./SDInterfaceState";
import React from "react";
import axios from "axios";

export class SDInterfaceAPI {

    private _state: SDInterfaceState | undefined;

    private readonly _setState: StateDispatcher<SDInterfaceState> | undefined;

    constructor(state?: SDInterfaceState, setState?: StateDispatcher<SDInterfaceState>) {
        this._state = state;
        this._setState = setState;
    }

    public updateState(state: SDInterfaceState) {
        this._state = state;
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
}

export const SDInterfaceAPIContext = React.createContext<SDInterfaceAPI>(new SDInterfaceAPI())
