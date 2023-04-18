import React, {useContext} from "react";
import Logo from "./assets/image-hub-logo.png";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {ImageSorterAPIContext} from "./ImageSorterAPI";

export type ImageHubBrandingProps = {
    centerLayout?: boolean
}

export const ImageHubBranding: React.FC<ImageHubBrandingProps> = props => {
    const api = useContext(ImageSorterAPIContext);

    return (
        <div style={{
            display: "flex",
            flexDirection: props.centerLayout ?? false ? "column" : "row",
            alignItems: "center",
            gap: ".7rem",
            paddingLeft: ".5rem"
        }}>
            <img src={Logo} width={40} height={40} alt={"Hub logo"}/>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: ".3rem",
            }}>
                <MainTypography text={"image"} style={{
                    fontSize: "20px"
                }}/>
                <MainTypography text={"hub"} style={{
                    fontSize: "20px",
                    fontWeight: "bold"
                }}/>
            </div>
            <DescriptiveTypography text={api.getVersionString()} style={{
                // fontSize: "20px",
                fontWeight: "bolder"
            }}/>
        </div>
    );
}
