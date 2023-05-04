import React from "react";
import {PromptShard} from "./PromptShard";
import styled from "styled-components";
import {DescriptiveTypography} from "../../../triton/components/typography/DescriptiveTypography";
import {AbcRounded, ChevronLeftRounded, CloseRounded} from "@mui/icons-material";
import {Main} from "../../../triton/components/layouts/Main";
import {MainTypography} from "../../../triton/components/typography/MainTypography";

export const StyledPromptShardPreview = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  padding: 8px;
  background-color: black;
  border-radius: 8px;
  gap: 6px;
  
  .icon-holder {
    border-radius: 8px;
    padding: 2px;
    background-color: lightgreen;
    color: #90EE90;
    display: flex;
    justify-content: center;
    align-items: center;
    
    svg {
      filter: brightness(.8);
    }
  }
`;

export type PromptShardPreviewProps = {
    for: PromptShard
}

export const PromptShardPreview: React.FC<PromptShardPreviewProps> = props => {

    return (
        <StyledPromptShardPreview>
            <div className={"icon-holder"}>
                <AbcRounded/>
            </div>
            <DescriptiveTypography text={props.for.display} style={{ color: "white" }}/>
            <DescriptiveTypography text={"1.4"} style={{ color: "white", fontWeight: "bold" }}/>
            {/*
            <ChevronLeftRounded style={{ color: "white", transform: "rotate(-90deg)" }}/>
            <ChevronLeftRounded style={{ color: "white", transform: "rotate(90deg)" }}/>
            */}
            <CloseRounded style={{ color: "white" }}/>
        </StyledPromptShardPreview>
    );
}
