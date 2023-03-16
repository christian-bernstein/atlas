import React, {PropsWithChildren} from "react";
import styled from "styled-components";

const StyledModalBodyForm = styled.form`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyledModalBody = styled.div`
  -webkit-box-flex: 1;
  flex-grow: 1;
  overflow: auto;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledModalFooter = styled.div`
  box-shadow: rgb(48, 54, 61) 0px -1px 0px;
  padding-top: 16px;
  display: flex;
  flex-flow: wrap;
  -webkit-box-pack: end;
  justify-content: flex-end;
  z-index: 1;
  flex-shrink: 0;
`;

export type ModalFormBodyProps = PropsWithChildren<{
    footer: JSX.Element,
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}>

export function ModalFormBody(props: ModalFormBodyProps): JSX.Element {
    return (
        <StyledModalBodyForm onSubmit={(event) => props.onSubmit?.(event)}>
            <StyledModalBody children={props.children}/>
            { props.footer && (
                <StyledModalFooter children={props.footer}/>
            ) }
        </StyledModalBodyForm>
    );
}
