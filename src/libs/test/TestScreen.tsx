import {BC} from "../base/BernieComponent";
import {Assembly} from "../base/logic/assembly/Assembly";
import {Themeable} from "../base/logic/style/Themeable";
import {Modal} from "../triton/components/dialogs/Modal";
import React, {useRef, useState} from "react";
import {Description} from "../base/components/base/Description";
import {Screen} from "../base/components/base/Page";
import {Formik} from "formik";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {v4} from "uuid";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ButtonBase, ButtonVariant} from "../triton/components/buttons/ButtonBase";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {GlobalStyles} from "@mui/material";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/core.css';
import {FormikSingleSelectInput} from "../triton/components/forms/FormikSingleSelectInput";
import {Color} from "../base/logic/style/Color";

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
    return (
        <Formik initialValues={{
            title: "",
            issuer: "",
            description: "",
            urgency: "",
            status: "",
            taskType: ""
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
                                        if (formikProps.dirty) {
                                            setBool(true);
                                        } else {
                                            props.onClose();
                                        }
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

                    <FormikSingleSelectInput name={"status"} formikProps={formikProps} title={"Status"} options={[
                        { text: "Todo", color: Color.ofHex("#238636") },
                        { text: "Selection for today" },
                        { text: "in Progress", color: Color.ofHex("#9e6a03") },
                        { text: "Await completion / On hold" },
                        { text: "Done", color: Color.ofHex("#8957e5") },
                        { text: "Cancelled" },
                    ]}/>

                    <FormikSingleSelectInput formikProps={formikProps} name={"urgency"} title={"Urgency"} options={[
                        { text: "Urgent", color: Color.ofHex("#da3633")},
                        { text: "High", color: Color.ofHex("#d29922") },
                        { text: "Medium" },
                        { text: "Low" }
                    ]}/>

                    <FormikSingleSelectInput formikProps={formikProps} name={"taskType"} title={"Task type"} options={[
                        { text: "Recurring" },
                        { text: "Onetime" }
                    ]}/>

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

