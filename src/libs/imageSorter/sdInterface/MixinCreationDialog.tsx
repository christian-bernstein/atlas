import React from "react";
import {Formik} from "formik";
import {StyledModal} from "../StyledModal";
import {FormElement} from "../../triton/components/forms/FormElement";
import {FormikSingleLineInput} from "../../triton/components/forms/FormikSingleLineInput";
import {ButtonBase} from "../../triton/components/buttons/ButtonBase";
import {SDPromptField} from "./SDPromptField";
import {px} from "../../base/logic/style/DimensionalMeasured";
import {MixinType} from "./MixinType";
import {TabBar} from "../TabBar";
import {CodeRounded, FunctionsRounded} from "@mui/icons-material";
import {isaDB} from "../ImageSorterAppDB";
import {v4} from "uuid";
import {ErrorMessage} from "../../triton/components/forms/ErrorMessage";

export type MixinCreationDialogProps = {
    onClose: () => void
}

export const MixinCreationDialog: React.FC<MixinCreationDialogProps> = props => {
    return (
        <Formik initialValues={{ key: "", substitution: "", type: String(MixinType.CONST) }} validate={values => {
            const errors: any = {};
            if (values.key.trim().length === 0) errors.key = "Mixin key cannot be empty";
            else if (!/^[\w_$]+$/i.test(values.key)) errors.key = "Mixin must only be alphanumeric with exceptions: '_' and '$'. No spaces allowed."
            return errors;
        }} onSubmit={values => {
            console.log("Adding mixin", values);
            isaDB.mixins.add({
                id: v4(),
                key: values.key,
                type: MixinType.CONST,
                target: values.substitution
            });

            props.onClose();

        }} children={fp => (
            <StyledModal title={"Create mixin"} onClose ={() => props.onClose()} children={
                <div style={{
                    display: "flex",
                    width: "100%",
                    gap: "1rem",
                    flexDirection: "column"
                }}>
                    <FormElement title={"Mixin key"} caption={"Used to call the mixin. E.g @sunshine"}>
                        <FormikSingleLineInput name={"key"} formikProps={fp}/>
                        <ErrorMessage formikProps={fp} name={"key"}/>
                    </FormElement>

                    <TabBar activeBar={String(fp.values.type)} onTabChange={tab => fp.setFieldValue("type", tab)} tabs={[
                        { id: String(MixinType.CONST), title: "Constant", icon: <CodeRounded/> },
                        { id: String(MixinType.FUNC), title: "Function", icon: <FunctionsRounded/> },
                    ]}/>

                    <FormElement title={"Constant substitution"} caption={"Constant substitution replaces the mixin key (E.g. @moonlight) with the exact value provided above."} children={
                        <SDPromptField key={"test123abc"} h={px(150)} onChange={value => {
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
