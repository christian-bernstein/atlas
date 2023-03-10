import React, {CSSProperties, PropsWithChildren} from "react";
import {Themeable} from "../../logic/style/Themeable";
import {utilizeGlobalTheme} from "../../logic/app/App";
import styled from "styled-components";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {getOr} from "../../Utils";
import {DimensionalMeasured, px} from "../../logic/style/DimensionalMeasured";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {createMargin, Margin} from "../../logic/style/Margin";
import {BernieComponent} from "../../BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {FlexWrap} from "../../logic/style/FlexWrap";

export type FlexBoxProps = PropsWithChildren<{
    onDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    flexDir?: FlexDirection,
    gap?: DimensionalMeasured,
    style?: CSSProperties,
    align?: Align,
    justifyContent?: Justify,
    width?: DimensionalMeasured,
    minWidth?: DimensionalMeasured,
    height?: DimensionalMeasured,
    overflowXBehaviour?: OverflowBehaviour,
    overflowYBehaviour?: OverflowBehaviour
    classnames?: string[],
    margin?: Margin,
    deactivateMarginSetting?: boolean,
    type?: 'div' | 'form',
    paddingX?: DimensionalMeasured,
    paddingY?: DimensionalMeasured,
    padding?: boolean,
    id?: string,
    elements?: Array<JSX.Element>,
    fw?: boolean,
    fh?: boolean,
    wrap?: FlexWrap
}>

export const FlexBox: React.FC<FlexBoxProps> = props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const margin: Margin = getOr(props.margin, createMargin(0, 0, 0, 0));
    const Wrapper = styled['div']`
      display: flex;
      padding: ${!props.padding ? "0" : ((getOr(props.paddingY, theme.paddings.defaultObjectPadding).css() + " " + getOr(props.paddingX, theme.paddings.defaultObjectPadding).css()))};
      flex-direction: ${getOr(props.flexDir, FlexDirection.COLUMN)};
      gap: ${getOr(props.gap?.css(), theme.gaps.defaultGab.css())};
      align-items: ${props.align || Align.START};
      justify-content: ${getOr(props.justifyContent, Justify.FLEX_START)};
      width: ${props.fw ? "100%" : getOr(props.width?.css(), "auto")};
      // todo does the removal of min-w break any 
        // min-width: ${getOr(props.minWidth, px()).css()};
      height: ${props.fh ? "100%" : getOr(props.height?.css(), "auto")};
      overflow-x: ${getOr<OverflowBehaviour>(props.overflowXBehaviour, OverflowBehaviour.VISIBLE)};
      overflow-y: ${getOr<OverflowBehaviour>(props.overflowYBehaviour, OverflowBehaviour.VISIBLE)};
      flex-wrap: ${getOr(props.wrap, FlexWrap.NOWRAP)};
      
      ${
        props.deactivateMarginSetting ? '' : `
          margin-top: ${margin.top?.css()};
          margin-bottom: ${margin.bottom?.css()};
          margin-left: ${margin.left?.css()};
          margin-right: ${margin.right?.css()};
        `
      }
    `;

    return (
        <Wrapper onDoubleClick={(event: any) => getOr(props.onDoubleClick, () => {})(event)} id={props.id} as={getOr(props.type, "div")} style={getOr(props.style, {})} className={getOr(props.classnames?.join(" "), "")}>
            {props.elements}
            {props.children}
        </Wrapper>
    );
}

export class FlexRow extends BernieComponent<FlexBoxProps, any, any> {

    componentRender(p: FlexBoxProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} {...p}/>
        );
    }
}

export {
    FlexBox as Flex
}
