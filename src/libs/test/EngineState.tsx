import {EngagementState} from "./EngagementState";
import {CoreState} from "../ship/test/core/CoreState";

export type EngineState = {
    id: string
    actualEProd: number,
    selectedEProd: number,
    manualSelectedProgram?: string,
    authority: string,
    engagementState: EngagementState
    cores: Array<CoreState>
}
