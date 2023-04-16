import React, {CSSProperties} from "react";
import styled from "styled-components";

export type MainTypographyProps = {
    text?: string,
    style?: CSSProperties,
    id?: string
}

export const MainTypography: React.FC<MainTypographyProps> = props => {
    const StyledTypography = styled.span`
      font-weight: 600;
      font-size: 14px;
      color: rgb(201, 209, 217);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      line-height: 1.5;
      word-wrap: break-word;
    `;

    return (
        <StyledTypography id={props.id} style={props.style} children={props.text}/>
    );
}
