import {BC} from "../../../base/BernieComponent";
import {Themeable} from "../../../base/logic/style/Themeable";
import {Assembly} from "../../../base/logic/assembly/Assembly";
import {Flex} from "../../../base/components/base/FlexBox";
import {DimensionalMeasured, px} from "../../../base/logic/style/DimensionalMeasured";
import React, {PropsWithChildren} from "react";
import {Orientation} from "../../../base/logic/style/Orientation";
import Collapse from "@mui/material/Collapse";
import {Separator} from "../../../base/components/base/Separator";
import {FlexDirection} from "../../../base/logic/style/FlexDirection";

export enum Anchorpoint {
    TOP, RIGHT, BOTTOM, LEFT
}

export type PanelProps = PropsWithChildren<{
    anchorpoint: Anchorpoint,
    visible?: boolean,
    size?: DimensionalMeasured
    id: string,

    // TODO: Implement -> also add isClosing / isOpening to the available Panel API
    // body: (panel: Panel) => JSX.Element
}>

export class Panel extends BC<PanelProps, any, any> {

    componentRender(p: PanelProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const orientation: Orientation = p.anchorpoint === Anchorpoint.BOTTOM || p.anchorpoint === Anchorpoint.TOP ? Orientation.HORIZONTAL : Orientation.VERTICAL;

        const PanelSlider = React.forwardRef((props, ref) => {
            return (
                <div ref={ref as any} {...props} style={{
                    height: "100%",
                    flexShrink: 0
                }} children={
                    (() => {
                        if (orientation === Orientation.VERTICAL) return (
                            <Flex fh gap={px()} flexDir={p.anchorpoint === Anchorpoint.LEFT ? FlexDirection.ROW_REVERSE : FlexDirection.ROW} elements={[
                                <Separator orientation={Orientation.VERTICAL}/>,
                                <Flex children={p.children} fh width={p.size ?? px(350)} style={{
                                    backgroundColor: t.colors.backgroundHighlightColor.css(),
                                }}/>
                            ]}/>
                        );

                        if (orientation === Orientation.HORIZONTAL) return (
                            <Flex fh gap={px()} flexDir={p.anchorpoint === Anchorpoint.TOP ? FlexDirection.COLUMN_REVERSE : FlexDirection.COLUMN} elements={[
                                <Separator orientation={Orientation.VERTICAL}/>,
                                <Flex children={p.children} fw height={p.size ?? px(350)} style={{
                                    backgroundColor: t.colors.backgroundHighlightColor.css(),
                                }}/>
                            ]}/>
                        );
                    })()
                }/>
            );
        });

        return (
            <Collapse sx={{
                flexShrink: 0,
                height: "100%",
            }} in={p.visible} unmountOnExit id={p.id} key={p.id} orientation={orientation === Orientation.HORIZONTAL ? "horizontal" : "vertical"} children={
                <PanelSlider/>
            }/>
        );
    }
}
