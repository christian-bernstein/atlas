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
  
  &[data-disabled=true] {
    opacity: .3;
  }
  
  .menu-main {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 8px;
  }
  
  &[data-disabled=false]:active, &:focus {
    background: rgba(177, 186, 196, 0.2) !important;
  }

  &[data-disabled=false]:hover, &.pointed {
    background: rgba(177, 186, 196, 0.12);
  }
  
  &:hover, &.pointed {
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
    appendix?: React.ReactNode,

    disabled?: boolean
}

export const MenuButton: React.FC<MenuButtonProps> = props => {
    const iconSize = "16px"
    const disabled = props.disabled ?? false;
    const mainClassName = `${props.isPointedTo ? "pointed" : ""}`;

    return (
        <MenuItem disabled={disabled} children={
            <StyledMenuButton data-disabled={disabled} className={mainClassName} onMouseEnter={() => props.onHover?.()} onClick={() => {
                if (!disabled) props.onSelect?.()
            }}>
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
