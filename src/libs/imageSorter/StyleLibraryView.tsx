import React, {useContext} from "react";
import {Formik} from "formik";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {StyleDataCardPreview} from "./StyleDataCardPreview";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {Menu} from "./Menu";
import {CheckMenuButton, MenuButton} from "./MenuButton";
import {VFSViewSettings} from "./VFSViewSettings";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {StyleLibrarySettings} from "./StyleLibrarySettings";
import {useAutoSettings, useSettings} from "./SettingsHook";

export const StyleLibraryView: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);

    const styles = useLiveQuery(() => {
        return isaDB.styles.toArray()
    });

    const settings = useAutoSettings<StyleLibrarySettings>("StyleLibrarySettings") ?? {
        previewImage: true
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflowY: "scroll",
            overflowX: "hidden",
            width: "100%"
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "auto min-content",
                gap: "8px",
                alignItems: "center"
            }}>
                <Formik initialValues={{}} onSubmit={values => {}} children={fp => (
                    <FormikSingleLineInput name={"search"} formikProps={fp}/>
                )}/>

                <Menu>
                    <CheckMenuButton text={"Style image preview"} checked={settings.previewImage} onSelect={() => {
                        api.settingsManager.updateSettingsObject<StyleLibrarySettings>("StyleLibrarySettings", prev => ({
                            ...prev,
                            previewImage: !prev.previewImage
                        })).then(() => {});
                    }}/>
                </Menu>
            </div>

            { styles !== undefined && (
                <TransitionGroup children={
                    styles.map(style => (
                        <Collapse key={style.id} style={{ marginBottom: "8px" }} children={
                            <StyleDataCardPreview showPreviewImage={settings.previewImage} data={style}/>
                        }/>
                    ))
                }/>
            ) }

            { (styles === undefined || styles.length === 0) && (
                <DescriptiveTypography text={"No styles"}/>
            ) }
        </div>
    );
}
