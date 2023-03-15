import React, {CSSProperties} from "react";
import styled from "styled-components";

export type DescriptiveTypographyProps = {
    text?: string,
    style?: CSSProperties
}

export const DescriptiveTypography: React.FC<DescriptiveTypographyProps> = props => {
    const StyledDescriptiveTypography = styled.span`
      font-size: 12px;
      color: rgb(139, 148, 158);
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      line-height: 1.5;
      word-wrap: break-word;
    `;

    return (
        <StyledDescriptiveTypography style={props.style} children={props.text}/>
    );
}
