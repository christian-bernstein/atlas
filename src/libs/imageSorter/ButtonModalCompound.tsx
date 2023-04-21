import React, {useState} from "react";
import {TransitionProps} from "react-transition-group/Transition";
import Grow from "@mui/material/Grow";
import Dialog from "@mui/material/Dialog";
import {CircularProgress} from "@mui/material";
import {CloseRounded} from "@mui/icons-material";

export type ButtonModalCompoundProps = {
    button: React.ReactNode,
    modalContent: (ctx: ModalCompoundContext) => React.ReactNode,

    onPreModalClose?: () => void,
    onUnsuccessfulClosingAttempt?: () => void,
    preventClosingOnBackdropClick?: boolean,
    preventClosingMasterSwitch?: boolean,
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Grow ref={ref} {...props} />;
});

export type ButtonModalCompoundState = {
    open: boolean
}

export type ModalCompoundContext = {
    close: () => void
}

export const ButtonModalCompound: React.FC<ButtonModalCompoundProps> = props => {
    const [state, setState] = useState<ButtonModalCompoundState>({
        open: false
    });

    return (
        <span>
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
                children={props.modalContent({
                    close: () => setState(prevState => ({ ...prevState, open: false }))
                })}
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

            <span onClick={() => setState(prevState => ({ ...prevState, open: true }))} children={
                props.button
            }/>
        </span>
    );
}
