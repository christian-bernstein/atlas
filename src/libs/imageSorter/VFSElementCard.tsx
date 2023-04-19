import React, {useContext, useEffect, useState} from "react";
import {VFSElement} from "./VFSElement";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {DownloadRounded, FolderRounded, ImageRounded, MoreVertRounded, SelectAllRounded} from "@mui/icons-material";
import styled from "styled-components";
import {Project} from "./Project";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {BooleanContext} from "../test/BooleanContext";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {MenuButton} from "./MenuButton";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {Menu} from "./Menu";

export const StyledVFSElementCard = styled.button`
  position: relative;
  background-color: #1e202a;
  border-radius: .5rem;
  aspect-ratio: 1 / 1;
  width: 100%;
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

const StyledVFSProjectCard = styled.button`
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: .1s all;
  aspect-ratio: 1 / 1;
  padding: 0 !important;
  border: none;
  background-color: #1e202a;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  color: white;

  .context-icon {
    transition: .1s all;
    position: absolute;
    opacity: 0;
    color: white;
    top: 5px;
    right: 5px;
    
    &:hover {
      color: #5028c8;
    }
  }
  
  &:hover {
    filter: brightness(1.2);
    
    .context-icon {
      opacity: 1;
    }
  }
`;

const VFSProjectCard: React.FC<{
    for: VFSElement,
    onSelect: () => void
}> = props => {
    const api = useContext(ImageSorterAPIContext);
    const [project, setProject] = useState<Project | undefined>(undefined);

    useEffect(() => {
        api.getProject(props.for.targetID!).then(cp => setProject(cp));
    }, [api, props.for.targetID]);

    const previewImage = useLiveQuery(async () => {
        return isaDB.images
            .where("id")
            .equals(project?.previewImageID ?? "")
            .first();
    }, [project]);

    return (
        <div style={{
            width:" 100%",
            display: "flex",
            aspectRatio: "1 / 1",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "4px"
        }}>
            <StyledVFSProjectCard type={"button"} onClick={() => {props.onSelect()}}>

                {
                    previewImage?.data !== undefined ? (
                        <img
                            src={URL.createObjectURL(previewImage?.data!)}
                            alt={"Project preview"}
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                                maxWidth: "100%",
                                width: "100%",
                                maxHeight: "100%",
                                height: "auto",
                            }}
                        />
                    ) : (
                        <ImageRounded/>
                    )
                }


                {/*
                <MoreVertRounded className={"context-icon"} onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                }}/>
                */}

            </StyledVFSProjectCard>

            <BooleanContext children={(bool, setBool) => {
                if (bool) {
                    return (
                        <input spellCheck={false} onBlur={() => {
                            setBool(false);
                        }} autoFocus defaultValue={props.for.title} onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                setBool(false);
                            }

                            if (e.key === "Enter") {
                                // TODO: Make function in api
                                const value = e.currentTarget.value;

                                if (value.trim().length === 0) return;

                                isaDB.vfsElements.update(props.for.id!, {
                                    "title": value
                                });
                                isaDB.projects.update(props.for.targetID!, {
                                    "title": value
                                })
                                setBool(false);
                            }
                        }} style={{
                            padding: 0,
                            outline: "none",
                            border: 0,
                            textAlign: "center",
                            backgroundColor: "transparent",
                            fontSize: "12px",
                            color: "rgb(139, 148, 158)",
                            fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
                            lineHeight: 1.5,
                            wordWrap: "break-word",
                            width: "100%"
                        }}/>
                    );
                } else {
                    return (
                        <DescriptiveTypography baseProps={{
                            onClick: () => {
                                console.log("Hello")
                                setBool(true)
                            }
                        }} text={props.for.title.trim().length === 0 ? "Add title" : props.for.title} style={{
                            textAlign: "center",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            width: "calc(80px - 24px)"
                        }}/>
                    );
                }
            }}/>
        </div>
    );
}

export const VFSElementCard: React.FC<{
    for: VFSElement,
    onSelect: () => void
}> = props => {
    if (props.for.type === "project") {
        return (
            <VFSProjectCard for={props.for} onSelect={props.onSelect}/>
        );
    }

    return (
        <StyledVFSElementCard type={"button"} onClick={() => {props.onSelect()}}>
            { props.for.type === "folder" ? (
                <FolderRounded/>
            ) : (
                <ImageRounded/>
            ) }

            <DescriptiveTypography text={props.for.title} style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "calc(80px - 24px)"
            }}/>
        </StyledVFSElementCard>
    );
}
