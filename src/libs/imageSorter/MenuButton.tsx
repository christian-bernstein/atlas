import React from "react";
import styled from "styled-components";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {Color} from "../base/logic/style/Color";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {MenuItem} from "@szhsin/react-menu";
import {CheckRounded} from "@mui/icons-material";

const StyledMenuButton = styled.span`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  width: 100%;
  color: rgb(201, 209, 217);
  transition: background 33.333ms linear 0s;
  text-decoration: none;
  justify-content: space-between;
  gap: 8px;
  
  .menu-main {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 8px;
  }
  
  &:active, &:focus {
    background: rgba(177, 186, 196, 0.2) !important;
  }

  &:hover, &.pointed {
    background: rgba(177, 186, 196, 0.12);
    cursor: pointer;
  }
  
  .menu-icon-tray {
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  .menu-appendix {
    margin-left: 1rem;
  }
`;

export type MenuButtonProps = {
    text: string,
    color?: Color | string,
    selected?: boolean,
    isPointedTo?: boolean,
    onSelect?: () => void,
    onHover?: () => void,

    icon?: React.ReactNode,
    appendix?: React.ReactNode
}

export const MenuButton: React.FC<MenuButtonProps> = props => {
    const iconSize = "16px"

    return (
        <MenuItem children={
            <StyledMenuButton className={props.isPointedTo ? "pointed" : ""} onMouseEnter={() => props.onHover?.()} onClick={() => props.onSelect?.()}>
                <div className={"menu-main"}>
                <span className={"menu-icon-tray"} style={{
                    width: iconSize,
                    height: iconSize,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }} children={
                    props.icon
                }/>
                    <MainTypography text={props.text} style={{
                        flexWrap: "nowrap",
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: "400"
                    }}/>
                </div>

                { props.appendix === undefined ? undefined : (
                    <div className={"menu-appendix"} children={
                        typeof props.appendix !== "string" ? props.appendix : (
                            <DescriptiveTypography text={props.appendix}/>
                        )
                    }/>
                ) }

            </StyledMenuButton>
        }/>

    );
}

export const CheckMenuButton: React.FC<MenuButtonProps & {
    checked?: boolean
}> = props => {
    return (
        <MenuButton {...props} selected={props.checked} icon={
            !props.checked ? undefined : (
                <CheckRounded/>
            )
        }/>
    );
}
