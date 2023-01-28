import {BC} from "../../../base/BernieComponent";
import {Themeable} from "../../../base/logic/style/Themeable";
import {Assembly} from "../../../base/logic/assembly/Assembly";
import {Flex} from "../../../base/components/base/FlexBox";
import {DimensionalMeasured, px} from "../../../base/logic/style/DimensionalMeasured";
import React, {PropsWithChildren} from "react";
import {Orientation} from "../../../base/logic/style/Orientation";

export enum Anchorpoint {
    TOP, RIGHT, BOTTOM, LEFT
}

export type PanelProps = PropsWithChildren<{
    anchorpoint: Anchorpoint,
    visible?: boolean,
    size?: DimensionalMeasured
}>

export class Panel extends BC<PanelProps, any, any> {

    componentRender(p: PanelProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const orientation: Orientation = p.anchorpoint === Anchorpoint.BOTTOM || p.anchorpoint === Anchorpoint.TOP ? Orientation.HORIZONTAL : Orientation.VERTICAL

        if (p.visible ?? true) {
            if (orientation === Orientation.VERTICAL) return (
                <Flex children={p.children} fh width={p.size ?? px(350)} style={{
                    backgroundColor: t.colors.backgroundHighlightColor.css(),
                    minWidth: (p.size ?? px(350)).css()
                }}/>
            );

            if (orientation === Orientation.HORIZONTAL) return (
                <Flex children={p.children} fw height={p.size ?? px(350)} style={{
                    backgroundColor: t.colors.backgroundHighlightColor.css(),
                    minHeight: (p.size ?? px(350)).css()
                }}/>
            );

        } else {
            return (
                <></>
            );
        }
    }
}
