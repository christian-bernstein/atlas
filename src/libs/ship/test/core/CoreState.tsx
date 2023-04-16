import {ManualOverridableValue} from "./ManualOverridableValue";

export type CoreState = {
    id: string,
    heat: number,
    fusePopped: boolean,
    coolingUnitLoad: number


    selectedLoad: ManualOverridableValue<number>,
    actualLoad: number
}

