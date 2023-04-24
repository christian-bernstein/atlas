import React from "react";
import {StyleData} from "./StyleData";
import {Formik} from "formik";
import {StyledModal} from "./StyledModal";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";

export type StyleDataEditDialogProps = {
    data: StyleData,
    onClose: () => void,
    onSave: (data: StyleData) => void
}

export const StyleDataEditDialog: React.FC<StyleDataEditDialogProps> = props => {
    return (
        <Formik initialValues={props.data} onSubmit={values => props.onSave(values)} children={fp => (
            <StyledModal
                onClose={() => props.onClose()}
                title={`Edit ${props.data.title}`}
                footer={
                    <div style={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px"
                    }}>
                        <ButtonBase text={"Save"} baseProps={{
                            onClick: e => fp.handleSubmit(e)
                        }}/>
                        <ButtonBase text={"Cancel"} baseProps={{
                            onClick: () => props.onClose()
                        }}/>
                    </div>
                }
            >
                <FormElement title={"Title"}>
                    <FormikSingleLineInput name={"title"} formikProps={fp}/>
                </FormElement>

                <FormElement title={"Description"}>
                    <FormikTextArea name={"description"} formikProps={fp}/>
                </FormElement>

                <FormElement title={"Meta"} caption={"Warning: Editing this might cause errors if not done 100% correctly"}>
                    <FormikTextArea name={"meta"} formikProps={fp}/>
                </FormElement>

            </StyledModal>
        )}/>
    );
}
