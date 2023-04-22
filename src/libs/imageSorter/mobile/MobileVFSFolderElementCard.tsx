import React from "react";
import {VFSElement} from "../VFSElement";
import styled from "styled-components";
import {FolderRounded, ImageRounded} from "@mui/icons-material";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {StyledVFSElementCard} from "../VFSElementCard";

export const StyledMobileVFSFolderElementCard = styled.button`
  position: relative;
  background-color: #1e202a;
  border-radius: .5rem;
  // aspect-ratio: 1 / 1;
  // width: 100%;
  height: calc(100px / 1.5) !important;
  width: 100px !important;
  
  flex-shrink: 0;
  
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-direction: column;
  border: none;
  color: white;
  cursor: pointer;
  transition: .1s all;
  padding: 0;
  overflow: hidden;
  
  &:hover {
    background-color: #2e3044;
  }
  
  &:active {
    transform: scale(.98);
  }
`;

export const MobileVFSFolderElementCard: React.FC<{
    for: VFSElement,
    onSelect: () => void
}> = props => {

    return (
        <StyledMobileVFSFolderElementCard type={"button"} onClick={() => {props.onSelect()}}>
            <FolderRounded/>

            <DescriptiveTypography text={props.for.title} style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "calc(100px - 24px)"
            }}/>
        </StyledMobileVFSFolderElementCard>
    );
}
