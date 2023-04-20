import React, {useContext, useState} from "react";
import {Image} from "./Image";
import styled from "styled-components";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {IconButton} from "./IconButton";
import {
    CloseRounded, DownloadRounded,
    EditRounded,
    FullscreenRounded,
    MoreVertRounded,
    RemoveRounded,
    SelectAllRounded
} from "@mui/icons-material";
import {Zoom} from "@mui/material";
import Grow from "@mui/material/Grow";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";
import {ButtonGroup} from "./ButtonGroup";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";

export const StyledAdvancedISAImage = styled.div`
  border-radius: .5rem;
  position: relative;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background-color: white;
  
  .isa-image {
    max-width: 100%;
    max-height: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center;
  }
  
  .isa-controls-header {
    width: 100%;
    padding: 6px 6px;
    display: flex;
    justify-content: space-between;
  }
  
  
`;

export type AdvancedISAImageProps = {
    image: Image
}

export type AdvancedISAImageState = {
    showControls: boolean,
    latchControls: boolean
}

export const AdvancedISAImage: React.FC<AdvancedISAImageProps> = props => {
    const api = useContext(ImageSorterAPIContext);

    const [state, setState] = useState<AdvancedISAImageState>({
        showControls: false,
        latchControls: false
    })

    const showControls = (b: boolean | undefined = undefined) => {
        if (b === undefined) {
            // Toggle mode
            setState(prevState => ({ ...prevState, showControls: !prevState.showControls }));
        } else {
            if (state.showControls !== b) {
                setState(prevState => ({ ...prevState, showControls: b }));
            }
        }
    }

    const areControlsOpened = () => state.latchControls || state.showControls;

    return (

        <StyledAdvancedISAImage
            onMouseEnter={event => showControls(true)}
            onMouseLeave={event => showControls(false)}
        >
            <TransitionGroup style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                paddingX: "1rem"
            }} children={
                areControlsOpened() && (
                    <Collapse timeout={150} children={
                        <div className={"isa-controls-header"}>
                            <IconButton size={"small"} children={<SelectAllRounded/>}/>
                            <IconButton size={"small"} children={<CloseRounded/>}/>
                        </div>
                    }/>
                )
            }/>

            <TransitionGroup style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                paddingX: "1rem"
            }} children={
                areControlsOpened() && (
                    <Collapse timeout={150} children={
                        <div className={"isa-controls-header"}>
                            <ButtonGroup>
                                <Menu opener={<IconButton size={"small"} children={<MoreVertRounded/>}/>}>

                                    <MenuButton text={"Fullscreen"} icon={<FullscreenRounded/>} appendix={<DescriptiveTypography text={"F11"}/>} onSelect={() => {

                                    }}/>

                                    <MenuButton text={"Download"} icon={<DownloadRounded/>} appendix={<DescriptiveTypography text={"Ctrl+D"}/>} onSelect={() => {
                                        api.downloadManager.downloadImage(props.image.id).then(() => {});
                                    }}/>
                                </Menu>
                                <IconButton size={"small"} children={<FullscreenRounded/>}/>
                            </ButtonGroup>
                        </div>
                    }/>
                )
            }/>

            <img className={"isa-image"} alt={props.image.id} draggable={false} src={URL.createObjectURL(props.image.data)}/>
        </StyledAdvancedISAImage>

    );
}
