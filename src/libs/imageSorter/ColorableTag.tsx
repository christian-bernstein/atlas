import React from "react";
import styled from "styled-components";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {Color} from "../base/logic/style/Color";

const StyledColorableTag = styled.button<ColorableTagProps>`
  border-radius: .3rem;
  border: none;
  background-color: ${p => p.c === undefined ? "#1e202a" : p.c.withAlpha(.1).css()};
  transition: background-color .1s;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px 8px;
  cursor: pointer;
  
  &:hover {
    filter: brightness(1.1);
    // background-color: ${p => p.highlightOnHover ?? true ? "#2e3044" : "#1e202a"};
  }
`;

export type ColorableTagProps = {
    tag: React.ReactNode,
    onClick?: () => void,
    highlightOnHover?: boolean,
    c?: Color
}

export const ColorableTag: React.FC<ColorableTagProps> = props => {
    return (
        <StyledColorableTag {...props} onClick={() => props.onClick?.()} children={
            typeof props.tag === "string" ? (
                <DescriptiveTypography text={props.tag} style={{
                    color: props.c?.css()
                }}/>
            ) : props.tag
        }/>
    );
}
