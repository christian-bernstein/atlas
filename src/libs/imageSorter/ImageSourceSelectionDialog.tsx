import React, {useState} from "react";
import {StyledModal} from "./StyledModal";
import {DefaultButton} from "./DefaultButton";
import {SelectAllRounded} from "@mui/icons-material";
import {vw} from "../base/logic/style/DimensionalMeasured";
import {Workspace} from "./Workspace";
import {TabBar} from "./TabBar";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {Image} from "./Image";

export type ImageSourceSelectionDialogState = {
    selectionMethod: SelectionMethod,
    selectedImages: Array<Image>
}

export enum SelectionMethod {
    FILE_UPLOAD,
    URL_FETCHER,
    INTERNAL_DATABASES
}

export const ImageSourceSelectionDialog: React.FC = props => {
    const [state, setState] = useState<ImageSourceSelectionDialogState>({
        selectionMethod: SelectionMethod.FILE_UPLOAD,
        selectedImages: []
    });

    return (
        <StyledModal w={vw(50)} title={"Select images..."} icon={<SelectAllRounded/>} footer={
            <DefaultButton variant={"primary"} size={"small"} children={
                <MainTypography text={"Select"}/>
            }/>
        }>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                height: "50vh"
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateRows: "min-content auto",
                    gap: "8px",
                    height: "100%"
                }}>
                    <Workspace config={{
                        name: "image-selectors-header",
                        mode: "desktop"
                    }} children={
                        <TabBar
                            activeBar={String(state.selectionMethod)}
                            onTabChange={tab => setState(prevState => ({ ...prevState, selectionMethod: tab as any}))}
                            tabs={[
                                { id: String(SelectionMethod.FILE_UPLOAD), title: "File upload" },
                                { id: String(SelectionMethod.URL_FETCHER), title: "Url" },
                                { id: String(SelectionMethod.INTERNAL_DATABASES), title: "Database transfer" },
                            ]}
                        />
                    }/>
                    <Workspace config={{
                        name: "image-selectors",
                        mode: "desktop"
                    }}/>
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateRows: "auto min-content",
                    gap: "8px",
                    height: "100%"
                }}>
                    <Workspace config={{
                        name: "preview",
                        mode: "desktop"
                    }}/>
                    <Workspace config={{
                        name: "preview-selection",
                        mode: "desktop"
                    }}/>
                </div>
            </div>
        </StyledModal>
    );
}
