import React from "react";
import styled from "styled-components";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";

const StyledTag = styled.button<TagProps>`
  border-radius: .3rem;
  border: none;
  background-color: #1e202a;
  transition: background-color .1s;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px 8px;
  cursor: pointer;
  
  &:hover {
    background-color: ${p => p.highlightOnHover ?? true ? "#2e3044" : "#1e202a"};
  }
`;

export type TagProps = {
    tag: React.ReactNode,
    onClick?: () => void,
    highlightOnHover?: boolean
}

export const Tag: React.FC<TagProps> = props => {
    return (
        <StyledTag {...props} onClick={() => props.onClick?.()} children={
            typeof props.tag === "string" ? (
                <DescriptiveTypography text={props.tag}/>
            ) : props.tag
        }/>
    );
}
