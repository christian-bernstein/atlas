import React from "react";
import {getOr} from "../../../base/Utils";

export type IfProps = {
    condition?: boolean,
    ifTrue?: JSX.Element,
    ifTrueGen?: () => JSX.Element,
    ifFalse?: JSX.Element,
    ifFalseGen?: () => JSX.Element,
    undefinedOnEmpty?: boolean
}

const loadElement = (ifVal?: JSX.Element, ifGen?: () => JSX.Element): JSX.Element | undefined => {
    if (ifVal !== undefined) {
        return ifVal;
    }
    ifGen?.();
}

export const If: React.FC<IfProps> = props => {
    if (props.condition) {
        return getOr(loadElement(props.ifTrue, props.ifTrueGen), getOr(props.undefinedOnEmpty, false) ? undefined : <></>) ?? <></>;
    } else {
        return getOr(loadElement(props.ifFalse, props.ifFalseGen), getOr(props.undefinedOnEmpty, false) ? undefined : <></>) ?? <></>;
    }
}
