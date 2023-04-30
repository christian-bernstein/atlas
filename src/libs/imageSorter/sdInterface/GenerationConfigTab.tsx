import React from "react";
import {VariableSlider} from "./VariableSlider";

export const GenerationConfigTab: React.FC = props => {

    return (
        <div style={{
            display: "grid",
            gap: "8px",
            gridTemplateColumns: "repeat(3, 1fr)"
        }}>
            <VariableSlider
                title={"Batch count"}
                defaultValue={1}
                minVal={1}
                maxVal={100}
            />
            <VariableSlider/>
            <VariableSlider/>
        </div>
    );
}
