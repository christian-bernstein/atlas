import React from "react";
import {Modal} from "../triton/components/dialogs/Modal";
import {v4} from "uuid";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {TagListConfigurator} from "./TagListConfigurator";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";
import {px} from "../base/logic/style/DimensionalMeasured";
import {ButtonBase, ButtonVariant} from "../triton/components/buttons/ButtonBase";
import {BooleanContext} from "../test/BooleanContext";
import {Formik} from "formik";

export type TagEditorProps = {
    open: boolean,
    onClose: () => void,
    onSave: (tags: Array<string>) => void,
    initialTags: Array<string>
}

export const TagEditor: React.FC<TagEditorProps> = props => {

    return (
        <Formik
            initialValues={{
                tagPrompt: "",
                tags: props.initialTags,
            }}
            onSubmit={(values) => props.onSave(values.tags)}
            children={formikProps => {
                return (
                    <Modal
                        title={"Edit tags"}
                        open={props.open}
                        onClose={() => props.onClose()}
                        onSubmit={(e) => {
                            formikProps.handleSubmit(e);
                        }}
                        children={
                            <TagListConfigurator formik={formikProps}/>
                        }
                        footer={
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "8px",
                                width: "100%"
                            }}>
                                <ButtonBase text={"Save"} baseProps={{
                                    type: "button",
                                    onClick: (e) => formikProps.handleSubmit(e)
                                }}/>
                                <ButtonBase text={"Cancel"} baseProps={{
                                    type: "button",
                                    onClick: () => props.onClose()
                                }}/>
                            </div>
                        }
                    />
                );
            }
        }/>
    );
}
