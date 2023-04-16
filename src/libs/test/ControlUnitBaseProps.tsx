import {ShipMainState} from "./TestScreen";

export type ControlUnitBaseProps = {
    state: ShipMainState,
    setState: ((value: (((prevState: ShipMainState) => ShipMainState) | ShipMainState)) => void)
}
