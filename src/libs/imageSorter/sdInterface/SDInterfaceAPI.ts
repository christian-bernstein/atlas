import {StateDispatcher} from "../../ship/test/core/StateDispatcher";
import {SDInterfaceState} from "./SDInterfaceState";
import React from "react";
import axios from "axios";
import {SDInterfaceRequestContextData} from "./SDInterfaceMain";
import {SDAPIRequestData} from "./SDAPIRequestData";
import {SDPromptEngine} from "./SDPromptEngine";

export class SDInterfaceAPI {

    private _state: SDInterfaceState | undefined;

    private readonly _setState: StateDispatcher<SDInterfaceState> | undefined;

    private _requestContextData: SDInterfaceRequestContextData | undefined;

    constructor(state?: SDInterfaceState, setState?: StateDispatcher<SDInterfaceState>, rcd?: SDInterfaceRequestContextData) {
        this._state = state;
        this._setState = setState;
        this._requestContextData = rcd;

        console.log("[sd api] NEW SD API INSTANCE CREATED");
        console.log("[sd api] state:", state, "state dispatcher availability:", setState !== undefined);
    }

    public updateState(state: SDInterfaceState) {
        console.log("[sd api] updating state reference", state);
        this._state = state;
    }

    public updateRequestContextData(rcd: SDInterfaceRequestContextData) {
        console.log("[sd api] updating RCD reference", rcd);
        this._requestContextData = rcd;
    }

    public updateRequestData(delta: Partial<SDAPIRequestData>) {
        console.log("[sd api] updating request data", delta);
        this.state.updateRequest?.(delta)
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

    public async generate() {
        this.setState(prevState => ({ ...prevState, phase: "generating" }));

        let progressRetriever = setInterval(() => {
            axios.get("http://127.0.0.1:7860/sdapi/v1/progress").then(res => {
                this.setState(prevState => ({
                    ...prevState,
                    progress: res.data,
                    previewImage: res.data.current_image
                }));
            });
        }, 500);

        const compiler = await new SDPromptEngine().initUserMixins();
        const compiledPromptData = compiler.parse(this.requestContextData.deltaRequestData?.prompt ?? "");
        const compiledNegativePromptData = compiler.parse(this.requestContextData.deltaRequestData?.negativePrompt ?? "");

        const conf = {
            // prompt: deltaRequestData.current.prompt,
            prompt: compiledPromptData.cmd,
            // negative_prompt: deltaRequestData.current.negativePrompt,
            negative_prompt: compiledNegativePromptData.cmd,
            steps: 60,
            sampler_index: "DPM++ 2M Karras",
            cfg_scale: 9,
            // width: 600,
            width: 600,
            // height: 960,
            height: 960,
            denoising_strength: 0.4,
            enable_hr: true,
            hr_scale: 1.5,
            hr_upscaler: "R-ESRGAN 4x+ Anime6B",
            hr_second_pass_steps: 100,
        };

        axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", conf).then(res => {
            clearInterval(progressRetriever);
            this.setState(prevState => ({
                ...prevState,
                phase: "default",
                resultImage: res.data.images,
                previewImage: undefined,
                progress: undefined
            }));
        }).catch(reason => {
            clearInterval(progressRetriever);
            this.setState(prevState => ({
                ...prevState,
                phase: "default",
                resultImage: prevState.previewImage ?? prevState.resultImage,
                progress: undefined
            }));
            alert("ERROR! " + reason);
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
