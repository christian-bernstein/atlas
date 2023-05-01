import React, {CSSProperties, PropsWithChildren} from "react";
import {DimensionalMeasured} from "../../../base/logic/style/DimensionalMeasured";

export type GridProps = PropsWithChildren<{
    props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    style?: CSSProperties,
    gTR?: string,
    gTC?: string,
    gap?: string | DimensionalMeasured
}>

export const Grid: React.FC<GridProps> = props => {
    const gap = props.gap === undefined ? "8px" : typeof props.gap === "string" ? props.gap : props.gap.css();

    return (
        <div {...props.props} children={props.children} style={{ ...props.style,
            display: "grid",
            gridTemplateColumns: props.gTC,
            gridTemplateRows: props.gTR,
            gap: gap
        }}/>
    );
}
