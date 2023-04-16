import React, {PropsWithChildren} from "react";
import styled from "styled-components";

export const StyledButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  user-select: none;
  position: relative;
  border: none;
  border-radius: .4rem;
  // overflow: hidden;
  
  & :first-child {
    border-radius: .4rem 0 0 .4rem !important;
  }

  & > button:last-of-type {
    border-radius: 0 .4rem .4rem 0 !important;
  }
  
  & > button {
    border-radius: 0;
  }
`;

export type ButtonGroupProps = PropsWithChildren<{
    orientation?: "horizontal" | "vertical"
}>

export const ButtonGroup: React.FC<ButtonGroupProps> = props => {

    return (
        <StyledButtonGroup children={props.children}/>
    );
}
