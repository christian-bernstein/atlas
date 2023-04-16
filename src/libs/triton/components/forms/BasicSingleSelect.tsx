import React, {useRef} from "react";
import {ControlledMenu, MenuItem, useClick, useMenuState} from "@szhsin/react-menu";
import {FormElement} from "./FormElement";
import {SmallBadge} from "../SmallBadge";
import {DescriptiveTypography} from "../typography/DescriptiveTypography";
import {Formik, FormikProps} from "formik";
import {FormikSingleLineInput} from "./FormikSingleLineInput";
import {ErrorMessage} from "./ErrorMessage";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {EnumElement} from "../../../test/EnumElement";
import {GenericInputContainer, SingleSelectOption} from "./FormikSingleSelectInput";

export type BasicSingleSelect = {
    selected?: string,
    onSelect?: (value: string) => void,
    name: string,
    title?: string,
    options: Array<SingleSelectOption>,
    disableSearchbar?: boolean,
    placeholder?: string,
    centerSelectedElementBadge?: boolean,
    onMenuButtonClick?: () => void,
}

const clickSound = new Audio(require("../../../../assets/sound/click.mp3"));

export const BasicSingleSelect: React.FC<BasicSingleSelect> = props => {
    const urgencyButtonRef = useRef<null | HTMLSpanElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const [menuState, toggleMenu] = useMenuState({ transition: true });
    const anchorProps = useClick(menuState.state, toggleMenu);
    // TODO Remove this / or make "better" solution
    let selectedOption = props.options.find(e => String(e.id) === props.selected);
    if (selectedOption === undefined) selectedOption = props.options.find(e => e.text === props.selected);

    return (
        <>
            <FormElement title={props.title} children={
                <span ref={urgencyButtonRef}>
                    <GenericInputContainer onMouseDownCapture={() => {
                        clickSound.play().then(() => {});
                        props.onMenuButtonClick?.()
                    }} type={"button"} {...anchorProps} children={
                        (selectedOption && (
                            (props.centerSelectedElementBadge ?? false) ? (
                                <span style={{
                                    marginLeft: "auto",
                                    marginRight: "auto"
                                }} children={
                                    <SmallBadge highlightOnHover={false} text={selectedOption.text} color={selectedOption.color}/>
                                }/>
                            ): (
                                <SmallBadge highlightOnHover={false} text={selectedOption.text} color={selectedOption.color}/>
                            )
                        )) ?? (
                            <DescriptiveTypography text={props.placeholder ?? "Choose an option..."} style={{
                                color: "rgb(110, 118, 129)",
                                cursor: "inherit"
                            }}/>
                        )
                    }/>
               </span>
            }/>

            <ControlledMenu
                portal={{
                    target: urgencyButtonRef.current,
                    stablePosition: true
                }}
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
                    props.onSelect?.(values.val);
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
                                    {props.options.filter(e => (e.text.toLowerCase().search(searchFormikProps.values.search.toLowerCase()) !== -1)).map(e => {
                                        // TODO: Improve
                                        const isSelected = e.text === selectedOption?.text || e.text === selectedOption?.id;

                                        return (
                                            <Collapse key={e.text}>
                                                <MenuItem style={{
                                                    backgroundColor: "transparent",
                                                    padding: "0",
                                                    margin: "0",
                                                    border: "0",
                                                    width: "100%"
                                                }}>
                                                    <EnumElement {...e} isPointedTo={searchFormikProps.values.pointed === e.text} onHover={() => {
                                                        searchFormikProps.setFieldValue("pointed", e.id ?? e.text)
                                                    }} text={e.text} selected={isSelected} onSelect={() => {
                                                        clickSound.play().then(() => {});
                                                        searchFormikProps.setFieldValue("val", e.id ?? e.text)
                                                        searchFormikProps.handleSubmit()
                                                    }}/>
                                                </MenuItem>
                                            </Collapse>
                                        );
                                    })}
                                </TransitionGroup>
                            </div>
                        </div>
                    );
                }}/>
            </ControlledMenu>
        </>
    );
}
