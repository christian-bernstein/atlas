import {ControlUnitBaseProps} from "./ControlUnitBaseProps";

export interface ControlUnit<T extends ControlUnitBaseProps, Impl> {
    props: T | undefined;

    setProps(props: T): Impl
}
