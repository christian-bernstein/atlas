import {BC} from "../../base/BernieComponent";
import {Themeable} from "../../base/logic/style/Themeable";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Folder} from "../data/Folder";
import {FlexBox} from "../../base/components/base/FlexBox";
import {percent, px} from "../../base/logic/style/DimensionalMeasured";
import {FlexDirection} from "../../base/logic/style/FlexDirection";
import {Tooltip} from "../../base/components/base/Tooltip";
import {Icon} from "../../base/components/base/Icon";
import {ObjectVisualMeaning, VM} from "../../base/logic/style/ObjectVisualMeaning";
import {Align} from "../../base/logic/style/Align";
import {Text, TextType} from "../../base/components/base/Text";
import {OverflowBehaviour} from "../../base/logic/style/OverflowBehaviour";
import React from "react";
import {Map} from "../../base/components/logic/Map";
import {array} from "../../base/Utils";
import {AF} from "../../base/components/logic/ArrayFragment";
import {Cursor} from "../../base/logic/style/Cursor";
import {ReactComponent as BackIcon} from "../../../assets/icons/ic-16/ic16-chevron-left.svg";
import {Button} from "../../base/components/base/Button";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {Description} from "../../base/components/base/Description";

export type FolderPathViewProps = {
    path: Array<Folder>;
    gotoFolder: (selectedFolder: Folder) => void
}

export class FolderPathView extends BC<FolderPathViewProps, any, any> {

    init() {
        super.init();
        this.prependAssembly();
        this.foldersAssembly();
    }

    private prependAssembly() {
        this.assembly.assembly("prepend", theme => {
            const path = this.props.path;
            if (path.length > 1) {
                // Can go back
                return (
                    <Button border={false} cursor={Cursor.pointer} onClick={() => {
                        this.props.gotoFolder(path[path.length - 2]);
                    }} children={
                        <Icon icon={<BackIcon/>} size={px(16)}/>
                    }/>
                );
            } else {
                // Already at the root
                return (
                    <Button border={false} cursor={Cursor.notAllowed} children={
                        <Icon icon={<BackIcon/>} size={px(16)} colored visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                    }/>
                );
            }
        });
    }

    private foldersAssembly() {
        this.assembly.assembly("folders", theme => {
            return (
                <Breadcrumbs separator="›" sx={{
                    ".MuiBreadcrumbs-separator": {
                        color: "#FFFFFF",
                    }
                }} children={
                    this.props.path.map((folder, index, data) => {
                        const isLast = !(index < data.length - 1);
                        return (
                            <Description
                                whitespace={"nowrap"}
                                text={`${folder.title}`}
                                cursor={Cursor.pointer}
                                highlight={isLast}
                                coloredText={isLast}
                                visualMeaning={isLast ? VM.INFO : VM.UI_NO_HIGHLIGHT}
                                onClick={() => {
                                    if (!isLast) {
                                        this.props.gotoFolder(folder);
                                    }
                                }
                            }/>
                        );
                    })
                }/>
            );
        });
    }

    componentRender(p: FolderPathViewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox
                flexDir={FlexDirection.ROW}
                width={percent(100)}
                align={Align.CENTER}
                gap={t.gaps.smallGab}
                elements={[
                    <FlexBox
                        gap={t.gaps.smallGab}
                        padding={false}
                        flexDir={FlexDirection.ROW}
                        style={{ flex: "0 1 auto" }}
                        elements={[this.a("prepend")]}
                    />,

                    <FlexBox
                        flexDir={FlexDirection.ROW}
                        gap={t.gaps.smallGab}
                        style={{ flex: "1 1 auto" }}
                        overflowYBehaviour={OverflowBehaviour.SCROLL}
                        elements={[this.a("folders")]}
                    />
                ]}
            />
        );
    }
}
