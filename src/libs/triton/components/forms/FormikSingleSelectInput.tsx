import React, {useRef} from "react";
import {ControlledMenu, MenuItem, useClick, useMenuState} from "@szhsin/react-menu";
import {FormElement} from "./FormElement";
import {FormikSingleLineInput} from "./FormikSingleLineInput";
import {Formik, FormikProps} from "formik";
import {ErrorMessage} from "./ErrorMessage";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {Color} from "../../../base/logic/style/Color";
import {EnumElement} from "../../../test/EnumElement";
import {SmallBadge} from "../SmallBadge";
import {ButtonBase} from "../buttons/ButtonBase";
import styled from "styled-components";
import {DescriptiveTypography} from "../typography/DescriptiveTypography";

export type SingleSelectOption = {
    text: string,
    color?: Color,
}

export type FormikSingleSelectInputProps = {
    formikProps: FormikProps<any>,
    name: string,
    title?: string,
    options: Array<SingleSelectOption>,

    disableSearchbar?: boolean
}

export const GenericInputContainer = styled.button`
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  color: rgb(201,209,217);
  vertical-align: middle;
  background-color: rgb(13,17,23);
  border: 1px solid rgb(48,54,61);
  border-radius: 6px;
  outline: none;
  box-shadow: transparent 0 0;
  min-height: 32px;
  width: 100%;
  display: flex;
  padding-left: 12px;
  padding-right: 12px;
  align-items: center;
  
  &:focus-within {
    border-color: rgb(88,166,255);
    outline: none;
    box-shadow: rgb(88,166,255) 0 0 0 1px inset;
  }
`;

export const FormikSingleSelectInput: React.FC<FormikSingleSelectInputProps> = props => {
    const urgencyButtonRef = useRef<null | HTMLSpanElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const [menuState, toggleMenu] = useMenuState({ transition: true });
    const anchorProps = useClick(menuState.state, toggleMenu);
    const formikProps = props.formikProps;
    const selectedOption = props.options.find(e => e.text === formikProps.values[props.name]);

    inputRef.current?.focus()

    return (
        <>
            <FormElement title={props.title} children={
                <span ref={urgencyButtonRef}>

                    <GenericInputContainer type={"button"} {...anchorProps} children={
                        (selectedOption && <SmallBadge highlightOnHover={false} text={selectedOption.text} color={selectedOption.color}/>) ?? (
                            <DescriptiveTypography text={"Choose an option..."} style={{
                                color: "rgb(110, 118, 129)",
                                cursor: "inherit"
                            }}/>
                        )
                    }/>

                    {/*
                    <FormikSingleLineInput name={props.name} formikProps={formikProps} baseProps={{
                        ...anchorProps,
                        readOnly: true,
                        onKeyDown: e => {
                            if (e.key === "Enter") {
                                toggleMenu()
                            }
                        },
                        style: {
                            cursor: "pointer"
                        }
                    }}/>
                    */}
               </span>
            }/>

            <ControlledMenu
                {...menuState}
                anchorRef={urgencyButtonRef}
                onClose={() => toggleMenu(false)}
                key={"top"}
                menuStyle={{
                    width: urgencyButtonRef.current?.offsetWidth ?? "auto",
                    borderRadius: "12px",
                    backgroundColor: "rgb(22, 27, 34)",
                    boxShadow: "rgb(48, 54, 61) 0px 0px 0px 1px, rgba(1, 4, 9, 0.85) 0px 16px 32px",
                    border: "none"
                }}
                arrowStyle={{
                    borderLeftColor: "rgb(48, 54, 61)",
                    borderTopColor: "rgb(48, 54, 61)",
                    backgroundColor: "rgb(22, 27, 34)"
                }}
                direction={"top"}
                align={"center"}
                theming={"dark"}
                transition={true}
                position={"anchor"}
                viewScroll={"auto"}
                arrow={true}
                offsetY={6}
            >
                <Formik initialValues={{
                    search: "",
                    val: "",
                    pointed: ""
                }} onSubmit={values => {
                    formikProps.setFieldValue(props.name, values.val);
                }} children={searchFormikProps => {

                    const getCurrentSelection: () => Array<SingleSelectOption> = () => {
                        return props.options.filter(e => (e.text.toLowerCase().search(searchFormikProps.values.search.toLowerCase()) !== -1))
                    }

                    const currentSelection = getCurrentSelection();
                    const getCurrent: () => SingleSelectOption | undefined = () => {
                        return currentSelection.find(e => (e.text.toLowerCase().search(searchFormikProps.values.pointed.toLowerCase()) !== -1))
                    }

                    if ((getCurrent() === undefined || searchFormikProps.values.pointed === "") && (currentSelection.length > 0)) {
                        searchFormikProps.setFieldValue("pointed", currentSelection[0].text)
                    }

                    return (
                        <div style={{
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            { !(props.disableSearchbar ?? false) && (
                                <div style={{
                                    padding: "8px",
                                    boxShadow: "rgb(48, 54, 61) 0px 1px 0px"
                                }}>
                                    <FormElement children={
                                        <>
                                            <FormikSingleLineInput ref={inputRef} baseProps={{
                                                onKeyDown: event => {
                                                    const getElement: (dir: "up" | "down") => (SingleSelectOption | undefined) = dir => {
                                                        const selection = currentSelection;
                                                        const currentIndex = selection.findIndex(ee => ee.text === searchFormikProps.values.pointed);
                                                        let newPos = currentIndex + (dir === "up" ? -1 : 1);
                                                        // "Clip" position
                                                        if (newPos >= selection.length) newPos = 0;
                                                        if (newPos < 0) newPos = selection.length - 1;
                                                        return selection[newPos];
                                                    }

                                                    if (event.key === "Enter") {
                                                        event.preventDefault();
                                                        searchFormikProps.setFieldValue("val", searchFormikProps.values.pointed)
                                                        searchFormikProps.handleSubmit()
                                                        toggleMenu(false);
                                                        return;
                                                    }

                                                    if (event.key === "ArrowUp") {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        const newVal = getElement("up")?.text;
                                                        searchFormikProps.setFieldValue("pointed", newVal);
                                                        return;
                                                    }

                                                    if (event.key === "ArrowDown") {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        const newVal = getElement("down")?.text;
                                                        searchFormikProps.setFieldValue("pointed", newVal);
                                                        return;
                                                    }
                                                }
                                            }} autoFocus placeholder={"Filter options"} name={"search"} formikProps={searchFormikProps}/>
                                            <ErrorMessage name={"search"} formikProps={formikProps}/>
                                        </>
                                    }/>
                                </div>
                            ) }

                            <div style={{
                                padding: "8px",
                                display: "grid",
                                gap: "4px"
                            }}>
                                <TransitionGroup>
                                    {props.options.filter(e => (e.text.toLowerCase().search(searchFormikProps.values.search.toLowerCase()) !== -1)).map(e => (
                                        <Collapse key={e.text}>
                                            <MenuItem style={{
                                                backgroundColor: "transparent",
                                                padding: "0",
                                                margin: "0",
                                                border: "0",
                                                width: "100%"
                                            }}>
                                                <EnumElement {...e} isPointedTo={searchFormikProps.values.pointed === e.text} onHover={() => {
                                                    searchFormikProps.setFieldValue("pointed", e.text)
                                                }} text={e.text} selected={formikProps.values[props.name] === e.text} onSelect={() => {
                                                    searchFormikProps.setFieldValue("val", e.text)
                                                    searchFormikProps.handleSubmit()
                                                }}/>
                                            </MenuItem>
                                        </Collapse>
                                    ))}
                                </TransitionGroup>
                            </div>
                        </div>
                    );
                }}/>
            </ControlledMenu>
        </>
    );
}
