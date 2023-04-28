import React, {useState} from "react";
import {Formik} from "formik";
import {StyledModal} from "../StyledModal";
import {FormElement} from "../../triton/components/forms/FormElement";
import {FormikSingleLineInput} from "../../triton/components/forms/FormikSingleLineInput";
import {ButtonBase} from "../../triton/components/buttons/ButtonBase";
import {SDPromptField} from "./SDPromptField";
import {px} from "../../base/logic/style/DimensionalMeasured";
import {MixinType} from "./MixinType";
import {TabBar} from "../TabBar";
import {TextFieldsRounded} from "@mui/icons-material";

export type MixinCreationDialogProps = {
    onClose: () => void
}

export const MixinCreationDialog: React.FC<MixinCreationDialogProps> = props => {
    return (
        <Formik initialValues={{ key: "", substitution: "", type: MixinType.CONST }} onSubmit={values => {}} children={fp => (
            <StyledModal title={"Create mixin"} onClose ={() => props.onClose()} children={
                <div style={{
                    display: "flex",
                    width: "100%",
                    gap: "8px",
                    flexDirection: "column"
                }}>
                    <FormElement title={"Mixin key"} caption={"Used to call the mixin. E.g @sunshine"} children={
                        <FormikSingleLineInput name={"key"} formikProps={fp}/>
                    }/>

                    <TabBar activeBar={String(fp.values.type)} onTabChange={tab => fp.setFieldValue("type", tab)} tabs={[
                        { id: "CONST", title: "Constant", icon: <TextFieldsRounded/> }
                    ]}/>

                    <FormElement title={"Constant substitution"} children={
                        <SDPromptField h={px(150)} onChange={value => {
                            fp.setFieldValue("substitution", value)
                        }}/>
                    }/>
                </div>
            } footer={
                <div style={{
                    display: "grid",
                    width: "100%",
                    gap: "8px",
                    gridTemplateColumns: "repeat(2, 1fr)"
                }}>
                    <ButtonBase text={"Create"} baseProps={{
                        onClick: (e) => fp.handleSubmit(e)
                    }}/>
                    <ButtonBase text={"cancel"} baseProps={{
                        onClick: () => props.onClose()
                    }}/>
                </div>
            }/>
        )}/>
    );
}
