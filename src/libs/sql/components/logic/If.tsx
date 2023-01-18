import React from "react";
import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {getOr} from "../../logic/Utils";

export type IfProps = {
    condition?: boolean,
    ifTrue?: JSX.Element,
    ifTrueGen?: () => JSX.Element,
    ifFalse?: JSX.Element,
    ifFalseGen?: () => JSX.Element,
    undefinedOnEmpty?: boolean
}

export class If extends BernieComponent<IfProps, any, any> {

    private loadElement(ifVal?: JSX.Element, ifGen?: () => JSX.Element): JSX.Element | undefined {
        if (ifVal !== undefined) {
            return ifVal;
        }
        ifGen?.();
    }

    componentRender(p: IfProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.condition) {
            return getOr(this.loadElement(p.ifTrue, p.ifTrueGen), getOr(p.undefinedOnEmpty, false) ? undefined : <></>);
        } else {
            return getOr(this.loadElement(p.ifFalse, p.ifFalseGen), getOr(p.undefinedOnEmpty, false) ? undefined : <></>);
        }
    }
}
