import React from "react";
import {ButtonBase, ButtonBaseProps} from "./ButtonBase";

export const DefaultButton: React.FC<ButtonBaseProps> = props => {
    return (
        <ButtonBase {...props}/>
    );
}
