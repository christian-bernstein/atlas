import React from "react";
import {CheckRounded} from "@mui/icons-material";
import {MainTypography} from "../triton/components/typography/MainTypography";
import styled from "styled-components";
import {Color} from "../base/logic/style/Color";
import {ColoredCircle} from "./ColoredCircle";

const StyledEnumElement = styled.span`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  width: 100%;
  color: rgb(201, 209, 217);
  transition: background 33.333ms linear 0s;
  text-decoration: none;
  gap: 8px;

  &:active, &:focus {
    background: rgba(177, 186, 196, 0.2) !important;
  }

  &:hover, &.pointed {
    background: rgba(177, 186, 196, 0.12);
    cursor: pointer;
  }
`;

export type EnumElementProps = {
    text: string,
    color?: Color | string,
    selected?: boolean,
    isPointedTo?: boolean,
    onSelect?: () => void,
    onHover?: () => void
}

export const EnumElement: React.FC<EnumElementProps> = props => {
    const iconSize = "16px"
    return (
        <StyledEnumElement className={props.isPointedTo ? "pointed" : ""} onMouseEnter={() => props.onHover?.()} onClick={() => props.onSelect?.()}>
            <span style={{
                width: iconSize,
                height: iconSize,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }} children={
                props.selected && (
                    <CheckRounded sx={{
                        width: iconSize,
                        height: iconSize,
                    }}/>
                )
            }/>


            <span style={{width: "14px", height: "14px", display: "flex"}} children={
                props.color && (
                    <ColoredCircle c={props.color}/>
                )
            }/>

            <MainTypography text={props.text} style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "400"
            }}/>
        </StyledEnumElement>
    );
}
