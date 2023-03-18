import {BC} from "../base/BernieComponent";
import {Assembly} from "../base/logic/assembly/Assembly";
import {Themeable} from "../base/logic/style/Themeable";
import {Modal} from "../triton/components/dialogs/Modal";
import React, {PropsWithChildren, useState} from "react";
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
import {GlobalStyles, Menu} from "@mui/material";
import Select from '@mui/material/Select';
import {FormikInput} from "../triton/components/forms/FormikInput";


export class TestScreen extends BC<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen style={{ flexDirection: "column-reverse" }} children={
                <>
                    <GlobalStyles styles={{
                        "& .MuiPaper-root": {
                            padding: "8px",
                            backgroundColor: "rgb(22, 27, 34) !important",
                            boxShadow: "rgb(48, 54, 61) 0px 0px 0px 1px, rgba(1, 4, 9, 0.85) 0px 16px 32px",
                            position: "absolute",
                            height: "auto",
                            borderRadius: "12px",
                            overflow: "hidden"
                        },
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
    return (
        <Formik initialValues={{
            title: "",
            issuer: "",
            description: ""
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

                    <FormElement title={"Description"} caption={"Visible in record headers and value pickers"} children={
                        <FormikTextArea name={"description"} formikProps={formikProps}/>
                    }/>
                </>
            }/>
        )}/>
    );
}

function ASampleMenu(): JSX.Element {
    const [open, setOpen] = useState(false);

    return (
        <Select
            open={open}
            sx={{
                backgroundColor: "rgb(33, 38, 45)",
                borderRadius: "6px",
                border: "1px solid rgba(240,246,252,0.1)"
            }}
            // input={
            //     <ButtonBase text={"Open select menu"} baseProps={{
            //         onClick: () => setOpen(true),
            //         style: {
            //             width: "100%"
            //         }
            //     }}/>
            // }
            // inputComponent={(props, context) => (
            //     <ButtonBase text={"Open select menu"} baseProps={{
            //         onClick: () => setOpen(true),
            //         style: {
            //             width: "100%"
            //         }
            //     }}/>
            // )}
            children={
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}>
                    <FormikInput children={
                        <input className={"input"}/>
                    }/>
                    <ButtonBase text={"Add record"} baseProps={{
                        onClick: () => setOpen(true)
                    }}/>
                </div>
            }
        />
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

            <ASampleMenu/>

            {
                records.map(rec => (
                    <DescriptiveTypography key={rec.id} text={JSON.stringify(rec)}/>
                ))
            }
        </div>
    );
}
