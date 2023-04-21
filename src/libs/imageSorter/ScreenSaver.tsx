import React, {useEffect, useRef, useState} from "react";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {Formik} from "formik";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {FormElement} from "../triton/components/forms/FormElement";
import {Zoom} from "@mui/material";
import {ImageHubBranding} from "./ImageHubBranding";
import {ChevronRightRounded, LoginRounded} from "@mui/icons-material";
import {IconButton} from "./IconButton";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {FormikFormCheckbox} from "./FormikFormCheckbox";
import styled from "styled-components";

const StyledScreenSaver = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  .view-opener {
    color: white;
    cursor: pointer;
    transition: all ease-in-out .1s;
    rotate: 90deg;

    &[data-opened=true] {
      rotate: -90deg;
    }
  }
`;

export type ScreenSaverState = {
    active: boolean,
    activationReason?: "manual" | "timeout",
    advancedSettingsTrayOpened: boolean
}

export const ScreenSaver: React.FC = props => {
    const [state, setState] = useState<ScreenSaverState>({
        active: false,
        advancedSettingsTrayOpened: false
    });

    const idleRef = useRef<any>();

    useEffect(() => {
        idleRef.current = setInterval(() => {
            if (data.current.idle > (60e3 * 3)) {
                if (!state.active) {
                    setState(prevState => ({
                        ...prevState,
                        active: true,
                        activationReason: "timeout"
                    }));
                }
            } else {
                data.current.idle += 5e3;
            }
        }, 5e3);

        return () => clearInterval(idleRef.current);
    }, []);

    const data = useRef<any>({
        idle: 0,
        listener: (event: KeyboardEvent) => {
            if (event.key === "Pause" && !state.active) {
                setState(prevState => ({
                    ...prevState,
                    active: true,
                    activationReason: "manual"
                }));
            }
        },
        mouseIdleListener: (event: MouseEvent) => {
            data.current.idle = 0;
        },
        keyboardIdleListener: (event: KeyboardEvent) => {
            data.current.idle = 0;
        },
    });

    useEffect(() => {
        window.addEventListener("keydown", data.current.listener, false);
        window.addEventListener("mousemove", data.current.mouseIdleListener, false);
        window.addEventListener("keydown", data.current.keyboardIdleListener, false);
        return () => {
            window.removeEventListener("keydown", data.current.listener, false);
            window.removeEventListener("mousemove", data.current.mouseIdleListener, false);
            window.removeEventListener("keydown", data.current.keyboardIdleListener, false);
        }
    }, []);

    return (
        <TransitionGroup style={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            left: 0,
            bottom: 0
        }} children={
            !state.active ? undefined : (
                <Collapse children={
                    <div style={{
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgb(26, 26, 32)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }} children={
                        <TransitionGroup children={
                            <Zoom children={
                                <StyledScreenSaver style={{
                                    width: "400px",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    backgroundColor: "rgb(16, 16, 22)",
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "column"
                                }}>
                                    <span style={{
                                        marginTop: "1.5rem",
                                        marginBottom: "1.5rem"
                                    }} children={
                                        <ImageHubBranding centerLayout/>
                                    }/>

                                    { state.activationReason === "timeout" ? (
                                        <DescriptiveTypography style={{
                                            textAlign: "center",
                                            marginTop: "1rem",
                                            marginBottom: "2rem"
                                        }} text={"Screen saver turned on due to inactivity of at least one minute. "}/>
                                    ) : undefined}

                                    <Formik initialValues={{ passcode: "" }} validate={values => {
                                        if (values.passcode.length >= 3 || values.passcode !== "123") {
                                            return {
                                                passcode: "Incorrect passcode"
                                            }
                                        }
                                    }} validateOnChange onSubmit={values => {}} children={fp => (
                                        <div style={{
                                            display: "flex",
                                            width: "100%",
                                            gap: "8px",
                                            alignItems: "center",
                                            flexDirection: "column"
                                        }}>
                                            <span style={{
                                                width: "100%"
                                            }} children={
                                                <FormElement title={"Passcode"} children={
                                                    <>
                                                        <FormikSingleLineInput autoFocus placeholder={"numerical passcode"} formikProps={fp} name={"passcode"} baseProps={{
                                                            type: "password",
                                                            onKeyDown: event => {
                                                                if (event.key === "Enter") fp.handleSubmit();
                                                            },
                                                            onChangeCapture: event => {
                                                                if (event.currentTarget.value === "123") {
                                                                    setState(prevState => ({
                                                                        ...prevState,
                                                                        active: false
                                                                    }));
                                                                }
                                                            }
                                                        }}/>
                                                        <ErrorMessage formikProps={fp} name={"passcode"}/>
                                                    </>
                                                }/>
                                            }/>


                                            <ChevronRightRounded
                                                onClick={() => setState(prevState => ({ ...prevState, advancedSettingsTrayOpened: !prevState.advancedSettingsTrayOpened }))}
                                                data-opened={state.advancedSettingsTrayOpened}
                                                className={"view-opener"}
                                            />

                                            <TransitionGroup style={{ width: "100%" }} children={
                                                !state.advancedSettingsTrayOpened ? undefined : (
                                                    <Collapse children={
                                                        <div style={{
                                                            width: "100%"
                                                        }}>
                                                            <FormikFormCheckbox
                                                                formik={fp}
                                                                title={"Disable automatic screen saver"}
                                                                name={"disableAutomaticScreensaverForSession"}
                                                                helpText={"After reloading the screensaver will be turned on again"}
                                                            />
                                                        </div>
                                                    }/>
                                                )
                                            }/>

                                        </div>
                                    )}/>
                                </StyledScreenSaver>
                            }/>
                        }/>
                    }/>
                }/>
            )
        }/>
    );
}
