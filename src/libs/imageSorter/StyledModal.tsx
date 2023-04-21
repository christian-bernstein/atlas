import React, {PropsWithChildren} from "react";
import styled from "styled-components";
import {CircularProgress} from "@mui/material";
import {CloseRounded} from "@mui/icons-material";
import {DimensionalMeasured} from "../base/logic/style/DimensionalMeasured";

const StyledModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(22, 27, 34);
  color: rgb(201, 209, 217);
  min-width: 296px;
  max-width: calc(100vw - 64px);
  max-height: calc(100vh - 64px);
  height: auto;
  border-radius: 12px;
  opacity: 1;
`;

const StyledModalHeader = styled.div`
  box-shadow: rgb(48, 54, 61) 0 1px 0;
  padding: 8px;
  z-index: 1;
  flex-shrink: 0;
  
  .dialog-header {
    display: flex;
        
    .dialog-header-title {
      padding: 6px 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      -webkit-box-flex: 1;
      flex-grow: 1;
      
      svg {
        width: 16px;
        height: 16px;
      }
      
      h1 {
        font-size: 14px;
        font-weight: 600;
        margin: 0;
        user-select: none;
      }
    }
    
    .dialog-close-button {
      border-radius: 4px;
      background: transparent;
      border: 0;
      vertical-align: middle;
      color: rgb(139, 148, 158);
      padding: 8px;
      align-self: flex-start;
      line-height: normal;
      box-shadow: none;
      
      &:disabled {
        cursor: not-allowed;
      }
      
      &:not(:disabled) {
        cursor: pointer;
        
        &:hover {
          background-color: rgb(48, 54, 61);
          border-color: rgb(139, 148, 158);
        }
      }
    }
  }
`;

const StyledModalBodyForm = styled.form`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyledModalBody = styled.div`
  -webkit-box-flex: 1;
  flex-grow: 1;
  overflow: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledModalFooter = styled.div`
  box-shadow: rgb(48, 54, 61) 0px -1px 0px;
  padding: 16px;
  display: flex;
  flex-flow: wrap;
  -webkit-box-pack: end;
  justify-content: flex-end;
  z-index: 1;
  flex-shrink: 0;
`;

export type StyledModalProps = PropsWithChildren<{
    showHeader?: boolean,
    customHeader?: React.ReactNode,
    footer?: React.ReactNode,
    closeDisplayMode?: "normal" | "disabled" | "hidden"
    loading?: boolean,
    icon?: React.ReactNode,
    title?: string,
    onClose?: () => void,
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void,
    w?: DimensionalMeasured | string,
}>

export const StyledModal: React.FC<StyledModalProps> = props => {
    const cdm = props.closeDisplayMode ?? "normal";
    const showHeader = props.showHeader ?? true;
    const width: string = props.w === undefined ? "320px" : (typeof props.w === "string" ? props.w : props.w.css());

    return (
        <StyledModalWrapper style={{ width: width }}>
            { showHeader && (
                props.customHeader ?? (
                    <StyledModalHeader children={
                        <div className={"dialog-header"}>
                            <div className={"dialog-header-title"}>
                                { !props.loading ? (props.icon === undefined ? undefined : props.icon) : (<CircularProgress size={16} color={"inherit"}/>) }
                                <h1 children={props.title}/>
                            </div>

                            { cdm !== "hidden" && (
                                <button className={"dialog-close-button"} disabled={cdm === "disabled"} onClick={() => props.onClose?.()} children={
                                    <CloseRounded sx={{
                                        width: "16px",
                                        height: "16px",
                                        display: "inline-block",
                                        userSelect: "none",
                                        verticalAlign: "text-bottom"
                                    }}/>
                                }/>
                            ) }
                        </div>
                    }/>
                )
            ) }

            {/* in StyledModalBodyForm ==> onSubmit={(event) => props.onSubmit?.(event)} */}
            <StyledModalBodyForm onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                props.onSubmit?.(event);
            }}>

                { props.children && (
                    <StyledModalBody children={props.children}/>
                ) }

                { props.footer && (
                    <StyledModalFooter children={props.footer}/>
                ) }

            </StyledModalBodyForm>
        </StyledModalWrapper>
    );
}
