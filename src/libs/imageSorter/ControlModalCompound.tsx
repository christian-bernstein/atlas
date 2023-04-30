import React, {useRef, useState} from "react";
import Dialog from "@mui/material/Dialog";
import {TransitionProps} from "react-transition-group/Transition";
import Grow from "@mui/material/Grow";

export type ModalRenderer = (ctx: ModalCompoundContext, param: any) => (React.ReactNode | [React.ReactNode, ModalPolicy]);

export type ModalDict = Map<string, ModalRenderer>;

export type ControlModalCompoundProps = {
    controller: (ctx: ModalCompoundContext) => React.ReactNode,
    modals: ModalDict,
    onPreModalClose?: () => void,
    onUnsuccessfulClosingAttempt?: () => void,
    preventClosingOnBackdropClick?: boolean,
    preventClosingMasterSwitch?: boolean
}

export type ModalPolicy = {

}

export type ControlModalCompoundState = {
    open: boolean,
    modalKey?: string,
    modalParam?: any,
    policy?: ModalPolicy
}

export type ModalCompoundContext = {
    close: () => void,
    open: (modalKey: string, modalParam: any) => void,
    param: () => any
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    // noinspection RequiredAttributes
    return <Grow ref={ref} {...props} />;
});

export const ControlModalCompound: React.FC<ControlModalCompoundProps> = props => {
    const [state, setState] = useState<ControlModalCompoundState>({
        open: false
    });

    const ctx = useRef<ModalCompoundContext>({
        open: (modalKey, modalParam) => {
            setState(prevState => ({
                ...prevState,
                open: true,
                modalKey: modalKey,
                modalParam: modalParam
            }));
        },
        close: () => {
            setState(prevState => ({
                ...prevState,
                open: false
            }));
        },
        param: () => state.modalParam
    });

    const renderer = props.modals.get(state.modalKey ?? "_noKey");

    const data = useRef<{
        policy?: ModalPolicy
    }>({});

    let modal = undefined;

    if (state.open && renderer !== undefined) {
        const res = renderer(ctx.current, state.modalParam);
        if (Array.isArray(res)) {
            const [jsx, policy] = res;
            data.current.policy = policy;
            modal = jsx;
        } else {
            modal = res;
        }
    }

    return (
        <>
            <Dialog
                onClose={(event, reason: "backdropClick" | "escapeKeyDown") => {
                    if (props.preventClosingMasterSwitch ?? false) {
                        props.onUnsuccessfulClosingAttempt?.();
                        return;
                    }
                    if (reason === "backdropClick" && (props.preventClosingOnBackdropClick ?? false)) {
                        props.onUnsuccessfulClosingAttempt?.();
                        return;
                    }
                    props.onPreModalClose?.();
                    setState(prevState => ({ ...prevState, open: false }));
                }}
                TransitionComponent={Transition}
                children={modal}
                keepMounted={false}
                open={state.open}
                sx={{
                    ".MuiPaper-root": {
                        backgroundColor: "transparent",
                        boxShadow: "rgb(48, 54, 61) 0px 0px 0px 1px, rgba(1, 4, 9, 0.85) 0px 16px 32px",
                        borderRadius: "12px"
                    }
                }}
            />

            {/* <span onClick={() => setState(prevState => ({ ...prevState, open: true }))} children={
                props.controller(ctx.current)
            }/> */}

            { props.controller(ctx.current) }
        </>
    );
}
