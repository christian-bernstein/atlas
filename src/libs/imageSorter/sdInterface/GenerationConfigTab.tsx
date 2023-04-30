import React from "react";
import {FormElement} from "../../triton/components/forms/FormElement";
import {Slider} from "@mui/material";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {IconButton} from "../IconButton";
import {RefreshRounded} from "@mui/icons-material";
import {Formik} from "formik";
import {VariableSlider} from "./VariableSlider";

export const GenerationConfigTab: React.FC = props => {

    return (
        <div style={{
            display: "grid",
            gap: "8px",
            gridTemplateColumns: "repeat(3, 1fr)"
        }}>
            <VariableSlider/>
            <VariableSlider/>
            <VariableSlider/>
        </div>
    );
}
