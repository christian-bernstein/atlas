import {BC} from "../base/BernieComponent";
import {Assembly} from "../base/logic/assembly/Assembly";
import {Themeable} from "../base/logic/style/Themeable";
import {Modal} from "./tests/Modal";
import React, {PropsWithChildren, useState} from "react";
import {Button} from "../base/components/base/Button";
import {Description} from "../base/components/base/Description";
import {Screen} from "../base/components/base/Page";
import {Field, Formik, FormikProps} from "formik";
import styled from "styled-components";
import {Flex} from "../base/components/base/FlexBox";
import {MainTypography} from "./tests/MainTypography";
import {DescriptiveTypography} from "./tests/DescriptiveTypography";
import {VM} from "../base/logic/style/ObjectVisualMeaning";
import {FlexDirection} from "../base/logic/style/FlexDirection";
import {px} from "../base/logic/style/DimensionalMeasured";
import {v4} from "uuid";
import {ModalFormBody} from "./tests/ModalFormBody";

export class TestScreen extends BC<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <ModalTest/>
            }/>
        );
    }
}

const FormikInput = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: rgb(201, 209, 217);
  vertical-align: middle;
  background-color: rgb(13, 17, 23);
  border: 1px solid rgb(48, 54, 61);
  border-radius: 6px;
  outline: none;
  box-shadow: transparent 0 0;
  -webkit-box-align: stretch;
  align-items: stretch;
  min-height: 32px;
  width: 100%;
  display: flex;

  &:focus-within {
    border-color: rgb(88, 166, 255);
    outline: none;
    box-shadow: rgb(88, 166, 255) 0 0 0 1px inset;
  }
      
  .input {
    padding-left: 12px;
    padding-right: 12px;
    cursor: text;
    border: 0;
    font-size: inherit;
    font-family: inherit;
    background-color: transparent;
    appearance: none;
    color: inherit;
    width: 100%; 
        
    &:focus {
      outline: 0;
    }
  }
`;

function FormikTextArea(props: { name: string, formikProps: FormikProps<any> }): JSX.Element {
    return (
        <FormikInput children={
            <textarea
                className={"input"}
                name={props.name}
                style={{
                    height: "140px",
                    padding: "12px",
                    resize: "vertical"
                }}
                onChange={props.formikProps.handleChange}
                onBlur={props.formikProps.handleBlur}
                value={props.formikProps.values[props.name]}
            />
        }/>
    );
}

function FormikSingleLineInput(props: { name: string }): JSX.Element {
    return (
        <FormikInput children={
            <Field class={"input"} name={props.name} />
        }/>
    );
}

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

function FormElement(props: PropsWithChildren<{
    title?: string,
    caption?: string
}>): JSX.Element {
    return (
        <InputGroup>
            { props.title && (
                <MainTypography text={props.title}/>
            ) }

            { props.children }

            { props.caption && (
                <DescriptiveTypography text={props.caption}/>
            ) }
        </InputGroup>
    );
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
