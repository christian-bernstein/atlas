import {BC} from "../base/BernieComponent";
import {Assembly} from "../base/logic/assembly/Assembly";
import {Themeable} from "../base/logic/style/Themeable";
import {Modal} from "../triton/components/dialogs/Modal";
import React, {useState} from "react";
import {Button} from "../base/components/base/Button";
import {Description} from "../base/components/base/Description";
import {Screen} from "../base/components/base/Page";
import {Formik} from "formik";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {VM} from "../base/logic/style/ObjectVisualMeaning";
import {v4} from "uuid";
import {ModalFormBody} from "../triton/components/dialogs/ModalFormBody";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";

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

function ModalTest(): JSX.Element {
    const [open, setOpen] = useState(false);
    const [records, setRecords] = useState<Record[]>([]);

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)} children={
                <Formik initialValues={{
                    title: "",
                    issuer: "",
                    description: ""
                }} onSubmit={(values, formikHelpers) => {
                    setTimeout(() => {
                        setRecords([...records, {
                            id: v4(),
                            title: values.title,
                            issuer: values.issuer,
                            description: values.description
                        }])
                        formikHelpers.setSubmitting(false)
                    }, 2000)
                }} children={props => (
                    <ModalFormBody
                        onSubmit={event => props.handleSubmit(event)}
                        children={
                            <>
                                <FormElement title={"Record name"} caption={"This is visible to all board members"} children={
                                    <FormikSingleLineInput name={"title"}/>
                                }/>

                                <FormElement title={"Issuer"} children={
                                    <FormikSingleLineInput name={"issuer"}/>
                                }/>

                                <FormElement title={"Description"} caption={"Visible in record headers and value pickers"} children={
                                    <FormikTextArea name={"description"} formikProps={props}/>
                                }/>
                            </>
                        }
                        footer={
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "4px"
                            }} children={
                                <>
                                    <Button type={"button"} style={{
                                        padding: "6px 16px"
                                    }} children={
                                        <MainTypography text={"Cancel"}/>
                                    } onClick={() => {
                                        setOpen(false)
                                    }}/>
                                    <Button type={"submit"} style={{
                                        padding: "6px 16px"
                                    }} visualMeaning={props.isSubmitting ? VM.UI_NO_HIGHLIGHT : VM.SUCCESS} children={
                                        <MainTypography style={{ color: "white" }} text={props.isSubmitting ? "Processing" : "Add record"}/>
                                    } onClick={(e) => {
                                        e.preventDefault();
                                        props.handleSubmit()
                                    }}/>
                                </>
                            }/>
                        }
                    />
                )}/>
            }/>


            <Button text={"Open modal"} onClick={() => setOpen(true)}/>
            {
                records.map(rec => (
                    <DescriptiveTypography text={JSON.stringify(rec)}/>
                ))
            }
        </>


    );
}
