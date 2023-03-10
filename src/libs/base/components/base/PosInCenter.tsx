import React, {CSSProperties, PropsWithChildren} from "react";
import styled from "styled-components";
import {getOr} from "../../Utils";

export type PosInCenterProps = PropsWithChildren<{
    style?: CSSProperties
    fullHeight?: boolean,
    classnames?: string[]
}>

export const Centered: React.FC<PosInCenterProps> = React.memo(props => {
    const Wrapper = styled.div`
      height: ${props.fullHeight ? "100%" : "auto"};
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    return (
        <Wrapper style={getOr(props.style, {})} className={getOr(props.classnames?.join(" "), "")}>
            {props.children}
        </Wrapper>
    );
})
