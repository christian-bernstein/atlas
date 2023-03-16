import React, {FC, PropsWithChildren} from "react";
import Dialog from '@mui/material/Dialog';
import {TransitionProps} from "react-transition-group/Transition";
import Grow from "@mui/material/Grow";
import styled from "styled-components";
import {CloseRounded} from "@mui/icons-material";
import {DimensionalMeasured} from "../../../base/logic/style/DimensionalMeasured";

export type ModalProps = PropsWithChildren<{
    open: boolean,
    title?: string,
    onClose: () => void,
    footer?: JSX.Element,
    w?: DimensionalMeasured | string,
    onSubmit?: () => void
}>;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Grow ref={ref} {...props} />;
});
const StyledModal = styled.div`
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
          flex-direction: column;
          -webkit-box-flex: 1;
          flex-grow: 1;
          
          h1 {
            font-size: 14px;
            font-weight: 600;
            margin: 0;
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
          cursor: pointer;
          
          &:hover {
            background-color: rgb(48, 54, 61);
            border-color: rgb(139, 148, 158);
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

export const Modal: FC<ModalProps> = props => {
    const width: string = props.w === undefined ? "320px" : (
        typeof props.w === "string" ? props.w : props.w.css()
    )

    return (
        <Dialog
            onClose={() => props.onClose()}
            TransitionComponent={Transition}
            keepMounted
            open={props.open}
            sx={{
                ".MuiPaper-root": {
                    backgroundColor: "transparent",
                    boxShadow: "rgb(48, 54, 61) 0px 0px 0px 1px, rgba(1, 4, 9, 0.85) 0px 16px 32px",
                    borderRadius: "12px"
                }
            }}
            children={
                <StyledModal style={{ width: width }}>
                    <StyledModalHeader children={
                        <div className={"dialog-header"}>
                            <div className={"dialog-header-title"}>
                                <h1 children={props.title}/>
                            </div>
                            <button className={"dialog-close-button"} onClick={() => props.onClose()} children={
                                <CloseRounded sx={{
                                    width: "16px",
                                    height: "16px",
                                    display: "inline-block",
                                    userSelect: "none",
                                    verticalAlign: "text-bottom"
                                }}/>
                            }/>
                        </div>
                    }/>
                    <StyledModalBodyForm onSubmit={() => props.onSubmit?.()}>
                        <StyledModalBody children={props.children}/>
                        { props.footer && (
                            <StyledModalFooter children={props.footer}/>
                        ) }
                    </StyledModalBodyForm>
                </StyledModal>
            }
        />
    );
}