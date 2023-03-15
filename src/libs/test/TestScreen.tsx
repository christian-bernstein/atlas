import {BC} from "../base/BernieComponent";
import {Assembly} from "../base/logic/assembly/Assembly";
import {Themeable} from "../base/logic/style/Themeable";
import {Modal} from "./tests/Modal";
import React, {useState} from "react";
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

export class TestScreen extends BC<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <ModalTest/>
            }/>
        );
    }
}

function ModalTest(): JSX.Element {
    const [open, setOpen] = useState(false);

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

    const InputGroup = styled.div`
      display: flex;
      flex-direction: column;
      gap: 4px;
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

    return (
        <>
            <Modal title={"Add record"} open={open} onClose={() => setOpen(false)} footer={
                <Flex gap={px(4)} flexDir={FlexDirection.ROW} elements={[
                    <Button style={{
                        padding: "6px 16px"
                    }} children={
                        <MainTypography text={"Cancel"}/>
                    } onClick={() => {
                        setOpen(false)
                    }}/>,
                    <Button style={{
                        padding: "6px 16px"
                    }} visualMeaning={VM.SUCCESS} children={
                        <MainTypography style={{ color: "white" }} text={"Save"}/>
                    } onClick={() => {

                    }}/>
                ]}/>
            } children={
                <Formik initialValues={{
                    title: "",
                    issuer: "",
                    description: ""
                }} onSubmit={(values, formikHelpers) => {
                    alert(values)
                }} children={props => (
                    <>
                        <InputGroup>
                            <MainTypography text={"Record name"}/>
                            <FormikInput children={
                                <Field class={"input"} name="title" />
                            }/>
                        </InputGroup>

                        <InputGroup>
                            <MainTypography text={"Issuer"}/>
                            <FormikInput children={
                                <Field class={"input"} name="issuer" />
                            }/>
                            <DescriptiveTypography text={"Visible in group headers and value pickers"}/>
                        </InputGroup>

                        <InputGroup>
                            <MainTypography text={"Description"}/>
                            <FormikInput children={
                                <textarea
                                    className={"input"}
                                    name="description"
                                    style={{
                                        height: "140px",
                                        padding: "12px",
                                        resize: "vertical"
                                    }}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.description}
                                />
                            }/>
                            <DescriptiveTypography text={"Visible in record headers and value pickers"}/>
                        </InputGroup>

                        <InputGroup>
                            <MainTypography text={"Description"}/>
                            <FormikTextArea name={"description"} formikProps={props}/>
                            <DescriptiveTypography text={"Visible in record headers and value pickers"}/>
                        </InputGroup>
                    </>
                )}/>
            }/>
            <Button text={"Open modal"} onClick={() => setOpen(true)}/>
        </>
    );
}
