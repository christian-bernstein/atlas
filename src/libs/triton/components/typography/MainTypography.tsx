import React, {CSSProperties} from "react";
import styled from "styled-components";

export type MainTypographyProps = {
    text?: React.ReactNode,
    style?: CSSProperties,
    id?: string,
    onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

export const StyledTypography = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: rgb(201, 209, 217);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  line-height: 1.5;
  word-wrap: break-word;
`;

export const MainTypography: React.FC<MainTypographyProps> = props => {
    return (
        <StyledTypography
            onClick={event => props.onClick?.(event)}
            children={props.text}
            style={props.style}
            id={props.id}
        />
    );
}
