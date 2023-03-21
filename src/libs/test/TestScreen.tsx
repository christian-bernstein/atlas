import {BC} from "../base/BernieComponent";
import {Assembly} from "../base/logic/assembly/Assembly";
import {Themeable} from "../base/logic/style/Themeable";
import {Modal} from "../triton/components/dialogs/Modal";
import React, {PropsWithChildren, useRef, useState} from "react";
import {Button} from "../base/components/base/Button";
import {Description} from "../base/components/base/Description";
import {Screen} from "../base/components/base/Page";
import {Formik} from "formik";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {VM} from "../base/logic/style/ObjectVisualMeaning";
import {v4} from "uuid";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ButtonBase, ButtonVariant} from "../triton/components/buttons/ButtonBase";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {GlobalStyles} from "@mui/material";
import Select from '@mui/material/Select';
import {FormikInput} from "../triton/components/forms/FormikInput";
import {
    MenuButton,
    MenuItem,
    Menu,
    MenuAlign,
    MenuPosition,
    MenuViewScroll,
    SubMenu,
    ControlledMenu, useClick, useMenuState
} from "@szhsin/react-menu";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/core.css';
import styled from "styled-components";
import {Color} from "../base/logic/style/Color";
import {CheckRounded} from "@mui/icons-material";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";

export class TestScreen extends BC<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen style={{ flexDirection: "column-reverse" }} children={
                <>
                    <GlobalStyles styles={{
                        "& .MuiList-root": {
                            padding: "0 !important"
                        }
                    }}/>
                    <ModalTest/>
                </>
            }/>
        );
    }
}

export type Record = {
    id: string,
    title: string,
    issuer: string,
    description: string
}

function BooleanContext(props: {
    initial?: boolean,
    children: (bool: boolean, setBool: ((value: (((prevState: boolean) => boolean) | boolean)) => void)) => JSX.Element
}): JSX.Element {
    const [bool, setBool]: [boolean, ((value: (((prevState: boolean) => boolean) | boolean)) => void)] = useState<boolean>(props.initial ?? false)
    return (
        <>{ props.children(bool, setBool) }</>
    )
}

function RecordDialog(props: { open: boolean, onCreate: (record: Record) => void, onClose: () => void }): JSX.Element {
    const urgencyButtonRef = useRef(null);
    const [menuState, toggleMenu] = useMenuState({ transition: true });
    const anchorProps = useClick(menuState.state, toggleMenu);

    return (
        <Formik initialValues={{
            title: "",
            issuer: "",
            description: "",
            urgency: ""
        }} onSubmit={(values, formikHelpers) => {
            setTimeout(() => {
                props.onCreate({
                    id: v4(),
                    title: values.title,
                    issuer: values.issuer,
                    description: values.description
                });
                formikHelpers.setSubmitting(false)
            }, 1e3);
        }} validate={values => {
            const errors: Partial<typeof values> = {};
            if (values.title.trim().length === 0) errors.title = "Record title is required"
            if (values.issuer.trim().length === 0) errors.issuer = "An issuer is required"
            return errors;
        }} children={formikProps => (
            <Modal
                preventClosingMasterSwitch={formikProps.isSubmitting}
                title={"Add record"}
                preventClosingOnBackdropClick
                open={props.open}
                onClose={() => props.onClose()}
                onSubmit={(e) => {
                    console.debug("Submitting..");
                    formikProps.handleSubmit(e);
                }}
                footer={
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "4px"
                }} children={
                    <>
                        <BooleanContext children={(bool, setBool) => (
                            <>
                                <Modal open={bool} preventClosingOnBackdropClick onClose={() => { setBool(false) }} title={"Abort"}>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, 1fr)",
                                        gap: "8px"
                                    }}>
                                        <ButtonBase text={"Cancel"} baseProps={{
                                            type: "button",
                                            onClick: () => {
                                                setBool(false);
                                            }
                                        }}/>
                                        <ButtonBase text={"Abort"} variant={ButtonVariant.DANGER} baseProps={{
                                            type: "button",
                                            onClick: () => {
                                                setBool(false);
                                                props.onClose();
                                            }
                                        }}/>
                                    </div>
                                </Modal>

                                <ButtonBase text={"Cancel"} baseProps={{
                                    type: "button",
                                    onClick: () => {
                                        setBool(true);
                                    }
                                }}/>
                            </>
                        )}/>

                        <ButtonBase variant={formikProps.isSubmitting ? ButtonVariant.DEFAULT : ButtonVariant.PRIMARY} text={formikProps.isSubmitting ? "Processing" : "Add record"} baseProps={{
                            type: "button",
                            onClick: () => {
                                formikProps.handleSubmit()
                            }
                        }}/>
                    </>
                }/>
            } children={
                <>
                    <FormElement title={"Record name"} caption={"This is visible to all board members"} children={
                        <>
                            <FormikSingleLineInput name={"title"} formikProps={formikProps}/>
                            <ErrorMessage name={"title"} formikProps={formikProps}/>
                        </>
                    }/>

                    <FormElement title={"Issuer"} children={
                        <>
                            <FormikSingleLineInput name={"issuer"} formikProps={formikProps}/>
                            <ErrorMessage name={"issuer"} formikProps={formikProps}/>
                        </>
                    }/>

                    <FormElement title={"Urgency"} children={
                        <span ref={urgencyButtonRef}>
                            <FormikSingleLineInput name={"urgency"} formikProps={formikProps} baseProps={{
                                ...anchorProps,
                                readOnly: true,
                                style: {
                                    cursor: "pointer"
                                }
                            }}/>
                        </span>
                    }/>



                    <ControlledMenu
                        {...menuState}
                        anchorRef={urgencyButtonRef}
                        onClose={() => toggleMenu(false)}

                        key={"top"}
                        menuStyle={{
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
                        offsetY={12}
                    >
                        <Formik initialValues={{ search: "", val: "" }} onSubmit={values => {
                            formikProps.setFieldValue("urgency", values.val)
                        }} children={searchFormikProps => (
                            <div style={{
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <div style={{
                                    padding: "8px",
                                    boxShadow: "rgb(48, 54, 61) 0px 1px 0px"
                                }}>
                                    <FormElement children={
                                        <>
                                            <FormikSingleLineInput autoFocus placeholder={"Filter options"} name={"search"} formikProps={searchFormikProps}/>
                                            <ErrorMessage name={"search"} formikProps={formikProps}/>
                                        </>
                                    }/>
                                </div>

                                <div style={{
                                    padding: "8px",
                                    display: "grid",
                                    gap: "4px"
                                }}>
                                    <TransitionGroup>
                                        {[
                                            { text: "Urgent", color: "#f85149", selected: true } as EnumElementProps,
                                            { text: "High", color: "#d29922" },
                                            { text: "Medium" },
                                            { text: "Low" },
                                        ].filter(e => (e.text.search(searchFormikProps.values.search) !== -1)).map(e => (
                                            <Collapse key={e.text}>
                                                <MenuItem style={{
                                                    backgroundColor: "transparent",
                                                    padding: "0",
                                                    margin: "0",
                                                    border: "0",
                                                    width: "100%"
                                                }}>
                                                    <EnumElement {...e} onSelect={() => {
                                                        searchFormikProps.setFieldValue("val", e.text)
                                                        searchFormikProps.handleSubmit()
                                                    }}/>
                                                </MenuItem>
                                            </Collapse>
                                        ))}
                                    </TransitionGroup>
                                </div>
                            </div>
                        )}/>
                    </ControlledMenu>

                    <FormElement title={"Description"} caption={"Visible in record headers and value pickers"} children={
                        <FormikTextArea name={"description"} formikProps={formikProps}/>
                    }/>
                </>
            }/>
        )}/>
    );
}

function ModalTest(): JSX.Element {
    const [open, setOpen] = useState(false);
    const [records, setRecords] = useState<Record[]>([]);

    return (
        <div style={{ display: "flex", flexDirection: "column-reverse", height: "100%", gap: "10px" }}>
            <RecordDialog
                open={open}
                onClose={() => setOpen(false)}
                onCreate={record => {
                    setRecords([...records, record]);
                    setOpen(false);
                }}
            />

            <ButtonBase text={"Add record"} baseProps={{
                onClick: () => setOpen(true)
            }}/>

            {
                records.map(rec => (
                    <DescriptiveTypography key={rec.id} text={JSON.stringify(rec)}/>
                ))
            }
        </div>
    );
}

const StyledEnumElement = styled.span`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  width: 100%;
  color: rgb(201, 209, 217);
  transition: background 33.333ms linear 0s;
  text-decoration: none;
  // margin-left: 8px;
  // margin-right: 8px;
  gap: 8px;

  &:active, &:focus {
    background: rgba(177, 186, 196, 0.2) !important;
  }

  &:hover {
    background: rgba(177, 186, 196, 0.12);
    cursor: pointer;
  }
`;

const ColoredCircle = styled.span<{
    c: Color | string
}>`
  background-color: ${props => {
      if (typeof props.c === "string") return props.c;
      else return props.c.css()
  }};
  width: 14px;
  height: 14px;
  border-radius: 8px;
  flex-shrink: 0;
`;

type EnumElementProps = {
    text: string,
    color?: Color | string,
    selected?: boolean,
    onSelect?: () => void
}

const EnumElement: React.FC<EnumElementProps> = props => {
    const iconSize = "16px"
    return (
        <StyledEnumElement onClick={() => props.onSelect?.()}>

            <span style={{ width: iconSize, height: iconSize, display: "flex", justifyContent: "center", alignItems: "center"}} children={
                props.selected && (
                    <CheckRounded sx={{
                        width: iconSize,
                        height: iconSize,
                    }}/>
                )
            }/>


            <span style={{ width: "14px", height: "14px", display: "flex"}} children={
                props.color && (
                    <ColoredCircle c={props.color}/>
                )
            }/>

            <MainTypography text={props.text} style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "400"
            }}/>
        </StyledEnumElement>
    );
}
