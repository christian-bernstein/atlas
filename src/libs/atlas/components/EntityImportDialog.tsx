import {BC} from "../../base/BernieComponent";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Themeable} from "../../base/logic/style/Themeable";
import Dropzone from "react-dropzone";
import React from "react";
import {StaticDrawerMenu} from "../../base/components/base/StaticDrawerMenu";
import {Box} from "../../base/components/base/Box";
import {Centered} from "../../base/components/base/PosInCenter";
import {Description} from "../../base/components/base/Description";
import {Align} from "../../base/logic/style/Align";
import {Cursor} from "../../base/logic/style/Cursor";
import {Flex, FlexRow} from "../../base/components/base/FlexBox";
import {DrawerHeader} from "../../base/components/base/DrawerHeader";
import {VM} from "../../base/logic/style/ObjectVisualMeaning";
import {SettingsGroup} from "../../base/components/base/SettingsGroup";
import {Button} from "../../base/components/base/Button";
import {percent, px} from "../../base/logic/style/DimensionalMeasured";
import {Icon} from "../../base/components/base/Icon";
import {Clear, DeleteOutlined, FileUploadRounded, MenuRounded, TransitEnterexitRounded} from "@mui/icons-material";
import {SettingsElement} from "../../base/components/base/SettingsElement";
import {createMargin} from "../../base/logic/style/Margin";
import {Dot} from "../../base/components/base/Dot";
import {Utils} from "../../base/Utils";

export type EntityImportDialogProps = {
    onSubmit: (files: File[]) => void,
    onCancel: () => void
}

export type EntityImportDialogLocalState = {
    files: File[],
}

export class EntityImportDialog extends BC<EntityImportDialogProps, any, EntityImportDialogLocalState> {

    constructor(props: EntityImportDialogProps) {
        super(props, undefined, {
            files: []
        });
    }

    componentRender(p: EntityImportDialogProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => {
                return (
                    <Flex align={Align.CENTER} fw elements={[


                        <DrawerHeader
                            badgeText={"Import"}
                            header={"Import files & folders"}
                            description={"Upload files and or folders from your file system directly into atlas\nThe underlying folder structure will be created on the fly"}
                            badgeVM={VM.UI_NO_HIGHLIGHT}
                            enableBadge
                            margin={createMargin(0, 0, 40, 0)}
                        />,


                        <FlexRow gap={t.gaps.smallGab} fw elements={[
                            <Button tooltip={"Close"} children={
                                <Icon icon={<TransitEnterexitRounded/>}/>
                            }/>,
                            <Button tooltip={"Clear"} children={
                                <Icon icon={<DeleteOutlined/>}/>
                            } onClick={() => {
                                this.local.setStateWithChannels({
                                    files: []
                                }, ["files"])
                            }}/>,
                            <Button children={
                                <Icon icon={<MenuRounded/>}/>
                            }/>,

                            this.component(local => (
                                local.state.files.length > 0 ? (
                                    <Button
                                        width={percent(100)}
                                        shrinkOnClick
                                        opaque
                                        visualMeaning={VM.SUCCESS_DEFAULT}
                                        height={px(38)}
                                        bgColorOnDefault={false}
                                        children={
                                            <Description text={"Import"}/>
                                        }
                                    />
                                ) : (
                                    <Button
                                        width={percent(100)}
                                        opaque
                                        highlight={false}
                                        cursor={Cursor.notAllowed}
                                        height={px(38)}
                                        visualMeaning={VM.UI_NO_HIGHLIGHT}
                                        children={
                                            <Description text={"Import"} cursor={Cursor.notAllowed}/>
                                        }
                                    />
                                )
                            ), "files"),
                        ]}/>,

                        <Dropzone onDrop={(acceptedFiles, fileRejections, event) => {
                            this.ls().files.push(...acceptedFiles)
                            this.local.setStateWithChannels({
                                files: this.ls().files
                            }, ["files"])
                        }}>
                            {({getRootProps, getInputProps}) => (
                                <section className="container" style={{ width: "100%" }}>
                                    <div {...getRootProps({className: 'dropzone'})}>
                                        <Box paddingY={px(30)} highlight cursor={Cursor.pointer} elements={[
                                            <Centered children={
                                                <>
                                                    <input {...getInputProps()} type={"file"} />
                                                    <Description cursor={Cursor.pointer} align={Align.CENTER} renderMarkdown={false} text={"Drag 'n' drop some files here, or click to select files"}/>
                                                </>
                                            }/>
                                        ]}/>
                                    </div>
                                </section>
                            )}
                        </Dropzone>,

                        this.component(local => (
                            local.state.files.length > 0 ? (
                                <SettingsGroup title={"Elements"} elements={
                                    local.state.files.map(file => (
                                        <SettingsElement groupDisplayMode title={""} iconConfig={{
                                            enable: true,
                                            color: t.colors.backgroundHighlightColor200,
                                            iconGenerator: element => <Icon icon={<FileUploadRounded/>}/>
                                        }} alternateTitleRenderer={element => (
                                            <Description cursor={Cursor.pointer} text={file.name}/>
                                        )} appendixGenerator={element => (
                                            <FlexRow gap={t.gaps.smallGab} margin={createMargin(0, t.gaps.smallGab.measurand, 0 ,0)} elements={[
                                                <Description cursor={Cursor.pointer} whitespace={"nowrap"} text={Utils.humanFileSize(file.size)}/>,
                                                <Dot/>,
                                                <Icon tooltip={"Remove"} icon={<Clear/>} visualMeaning={VM.ERROR} uiNoHighlightOnDefault coloredOnDefault={false} colored/>
                                            ]}/>
                                        )}/>
                                    ))
                                }/>
                            ) : (<></>)
                        ), "files"),
                    ]}/>
                );
            }}/>
        );
    }
}
