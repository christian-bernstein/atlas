import React from "react";
import Dropzone, {DropzoneProps} from "react-dropzone";
import styled from "styled-components";
import {utilizeGlobalTheme} from "../../base/logic/app/App";
import {CloudOutlined} from "@mui/icons-material";

export type FileDropzoneProps = DropzoneProps & {}

export const FileDropzone: React.FC<FileDropzoneProps> = props => {
    const theme = utilizeGlobalTheme();
    const Section = styled.section`
      height: 150px;
      background-color: ${theme.colors.backgroundHighlightColor.css()};
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: ${theme.radii.defaultObjectRadius.css()};
      border: 1px dashed ${theme.colors.borderPrimaryColor.css()};
      transition: all 200ms;
      cursor: pointer;
      text-align: center;
      
      &:hover {
        border: 1px dashed ${theme.colors.primaryHighlightColor.css()};
      }
      
      .dropzone {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      
      .icon {
        width: 30px;
        height: 30px;
        fill: ${theme.colors.primaryHighlightColor.css()}
      }

      .main {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        
        p {
          margin: 0 !important;
        }

        .title {
          font-family: ${theme.texts.fontFamily};
          font-size: 13px;
          font-weight: normal;
          color: ${theme.colors.fontPrimaryColor.css()};
        }

        .description {
          font-family: ${theme.texts.fontFamily};
          font-size: 11px;
          font-weight: 300;
          color: ${theme.colors.fontSecondaryColor.css()};
        }
      }
    `;

    return (
        <Dropzone {...props}>
            {({getRootProps, getInputProps}) => (
                <Section className="container" style={{ width: "100%" }} children={
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input {...getInputProps()} type={"file"} />
                        <CloudOutlined className={"icon"}/>
                        <div className={"main"}>
                            <p className={"title"}>Drop your files</p>
                            <p className={"description"}>Supports all file formats</p>
                        </div>
                    </div>
                }/>
            )}
        </Dropzone>
    );
}
