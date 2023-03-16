import {BC} from "../base/BernieComponent";
import {Assembly} from "../base/logic/assembly/Assembly";
import {Themeable} from "../base/logic/style/Themeable";
import {Modal} from "../triton/components/dialogs/Modal";
import React, {useState} from "react";
import {Button} from "../base/components/base/Button";
import {Description} from "../base/components/base/Description";
import {Screen} from "../base/components/base/Page";
import {ErrorMessage, Formik} from "formik";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {VM} from "../base/logic/style/ObjectVisualMeaning";
import {v4} from "uuid";
import {ModalFormBody} from "../triton/components/dialogs/ModalFormBody";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {FormikInput} from "../triton/components/forms/FormikInput";

export class TestScreen extends BC<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <ModalTest/>
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

function RecordDialog(props: { open: boolean, onCreate: (record: Record) => void, onClose: () => void }): JSX.Element {
    return (
        <Formik initialValues={{
            title: "",
            issuer: "",
            description: ""
        }} onSubmit={(values, formikHelpers) => {
            props.onCreate({
                id: v4(),
                title: values.title,
                issuer: values.issuer,
                description: values.description
            });
            formikHelpers.setSubmitting(false)
        }} children={formikProps => (
            <Modal title={"Add record"} open={props.open} onClose={() => props.onClose()} onSubmit={(e) => formikProps.handleSubmit(e)} footer={
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "4px"
                }} children={
                    <>
                        <Button style={{
                            padding: "6px 16px"
                        }} children={
                            <MainTypography text={"Cancel"}/>
                        } onClick={() => {
                            props.onClose()
                        }}/>
                        <Button type={"button"} style={{
                            padding: "6px 16px"
                        }} visualMeaning={formikProps.isSubmitting ? VM.UI_NO_HIGHLIGHT : VM.SUCCESS} children={
                            <MainTypography style={{ color: "white" }} text={formikProps.isSubmitting ? "Processing" : "Add record"}/>
                        } onClick={(e) => {
                            console.log("Clicked on submit button")
                            formikProps.handleSubmit()
                        }}/>
                    </>
                }/>
            } children={
                <>
                    <FormElement title={"Record name"} caption={"This is visible to all board members"} children={
                        <FormikSingleLineInput name={"title"} formikProps={formikProps} autoFocus/>
                    }/>

                    <FormElement title={"Issuer"} children={
                        <FormikSingleLineInput name={"issuer"} formikProps={formikProps}/>
                    }/>

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
        <>
            <RecordDialog
                open={open}
                onClose={() => setOpen(false)}
                onCreate={record => {
                    setRecords([...records, record]);
                    setOpen(false);
                }}
            />

            <Button text={"Open modal"} onClick={() => setOpen(true)}/>
            {
                records.map(rec => (
                    <DescriptiveTypography key={rec.id} text={JSON.stringify(rec)}/>
                ))
            }
        </>


    );
}
