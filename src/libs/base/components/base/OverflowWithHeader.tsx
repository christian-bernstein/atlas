import {BC} from "../../BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {DimensionalMeasured, percent, px} from "../../logic/style/DimensionalMeasured";
import {Dimension} from "../../logic/style/Dimension";
import {FlexBox} from "./FlexBox";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import React from "react";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {getOr} from "../../Utils";

export type OverflowWithHeaderProps = {
    dir?: FlexDirection
    height?: DimensionalMeasured,
    gap?: DimensionalMeasured,
    overflowContainer: {
        gap?: DimensionalMeasured,
        elements: Array<JSX.Element>
    },
    staticContainer: {
        gap?: DimensionalMeasured,
        elements: Array<JSX.Element>
    },
    staticContainerHeader?: {
        gap?: DimensionalMeasured,
        elements: Array<JSX.Element>
    }
}

export class OverflowWithHeader extends BC<OverflowWithHeaderProps, any, any> {

    componentRender(p: OverflowWithHeaderProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox
                gap={getOr(p.gap, px())}
                flexDir={p.dir}
                height={getOr(p.height, DimensionalMeasured.of(100, Dimension.vh))}
                width={percent(100)}
                elements={[
                    p.staticContainerHeader === undefined ? <></> : (
                        <FlexBox
                            gap={p.staticContainerHeader.gap}
                            fw
                            padding={false}
                            style={{ flex: "0 1 auto" }}
                            elements={p.staticContainerHeader.elements}
                        />
                    ),

                    <FlexBox
                        gap={p.overflowContainer.gap}
                        fw
                        style={{ flex: "1 1 auto" }}
                        overflowYBehaviour={OverflowBehaviour.SCROLL}
                        elements={p.overflowContainer.elements}
                    />,

                    <FlexBox
                        gap={p.staticContainer.gap}
                        fw
                        padding={false}
                        style={{ flex: "0 1 auto" }}
                        elements={p.staticContainer.elements}
                    />
                ]}
            />
        );
    }
}
