import React, {useContext} from "react";
import {Image} from "./Image";
import styled from "styled-components";
import {DeleteRounded} from "@mui/icons-material";
import {ImageSorterAPIContext} from "./ImageSorterAPI";

export type ImagePreviewProps = {
    for: Image,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
    onRequestDelete: () => void
}

const StyledImagePreview = styled.button<{
    isOpenedInMainView: boolean
}>`
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: .1s all;
  padding: 0 !important;
  border: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .delete-icon {
    transition: .1s all;
    position: absolute;
    opacity: 0;
    color: white;
    top: 5px;
    right: 5px;
    
    &:hover {
      color: crimson;
    }
  }
  
  &:hover {
    filter: brightness(1.2);
    
    .delete-icon {
      opacity: 1;
    }
  }
  
  &.view-selected, &.view-selected.selected {
    box-shadow: 0 0 0 2px #101016, 0 0 0 3.5px #5028c8;
  }

  &.selected {
    transform: scale(.9);
    // box-shadow: 0 0 0 2px #101016, 0 0 0 3.5px lightgreen;
    box-shadow: 0 0 0 2px #101016, 0 0 0 3.5px crimson;
  }
`;

export const ImagePreview: React.FC<ImagePreviewProps> = props => {
    const api = useContext(ImageSorterAPIContext);
    const isOpenedInMainView = api.state.selectedImageId === props.for.id;
    const isSelected = api.state.selectedImages.includes(props.for.id);

    return (
        <StyledImagePreview className={`${isOpenedInMainView ? "view-selected" : ""} ${isSelected ? "selected" : ""}`} isOpenedInMainView={isOpenedInMainView} style={{
            borderRadius: "8px",
            overflow: "hidden",
            cursor: "pointer"
        }} type={"button"} onClick={(event) => {
            props.onClick(event);
        }}>
            <img alt={"img"} src={URL.createObjectURL(props.for.data)} style={{
                objectFit: "cover",
                objectPosition: "center",
                maxWidth: "100%",
                maxHeight: "100%",
                height: "auto",
                aspectRatio: "1 / 1",
            }}/>

            <DeleteRounded className={"delete-icon"} onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                props.onRequestDelete();
            }}/>
        </StyledImagePreview>
    );
}
