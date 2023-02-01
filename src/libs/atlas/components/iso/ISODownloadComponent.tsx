import {BC} from "../../../base/BernieComponent";
import {Themeable} from "../../../base/logic/style/Themeable";
import {Assembly} from "../../../base/logic/assembly/Assembly";
import {AtlasMain} from "../../AtlasMain";
import {Flex, FlexRow} from "../../../base/components/base/FlexBox";
import {StaticDrawerMenu} from "../../../base/components/base/StaticDrawerMenu";
import React from "react";
import fileDownload from 'js-file-download';
import {Button} from "../../../base/components/base/Button";
import {DrawerHeader} from "../../../base/components/base/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../../base/logic/style/ObjectVisualMeaning";
import {percent, px} from "../../../base/logic/style/DimensionalMeasured";
import {Align} from "../../../base/logic/style/Align";
import {Text, TextType} from "../../../base/components/base/Text";
import {Badge} from "../../../base/components/base/Badge";
import {createMargin} from "../../../base/logic/style/Margin";
import {CodeDisplay} from "../../../base/components/base/CodeDisplay";
import {Screen} from "../../../base/components/base/Page";
import {OverflowBehaviour} from "../../../base/logic/style/OverflowBehaviour";
import {ISOBase} from "../../iso/ISOBase";
import {Q, Queryable} from "../../../base/logic/query/Queryable";
import {QueryDisplay} from "../../../base/components/logic/QueryDisplay";
import {Input} from "../../../base/components/base/Input";
import {QueryError} from "../../../base/logic/query/QueryError";
import {InformationBox} from "../../../base/components/base/InformationBox";
import {Description} from "../../../base/components/base/Description";
import {TextArea} from "../../../base/components/base/TextArea";
import {Icon} from "../../../base/components/base/Icon";
import {CloseRounded, CodeRounded, Download, Fingerprint} from "@mui/icons-material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Cursor} from "../../../base/logic/style/Cursor";
import IconButton from '@mui/material/IconButton';
import {as} from "../../Lang";

export type ISODownloadComponentLocalState = {
    iso: Q<ISOBase | undefined>,
    fileFormat: "json" | "atlas",
    fileTitleAppendix: string,
    isoDescription: string
}

export class ISODownloadComponent extends BC<any, any, ISODownloadComponentLocalState> {

    constructor() {
        super(undefined, undefined, {
            fileTitleAppendix: "",
            isoDescription: "",
            fileFormat: "atlas",
            iso: new Queryable<ISOBase | undefined>({
                component: () => this,
                listeners: ["iso"],
                fallback: undefined,
                process: (resolve, reject) => {
                    AtlasMain.atlas().api().isoAdapter("v1").createISO().then(iso => {
                        resolve(iso);
                    }).catch(reason => {
                        reject({
                            code: -1,
                            object: reason
                        });
                    });
                }
            })
        });
    }

    private getAppendix(): string {
        return this.ls().fileTitleAppendix.trim();
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.iso.query();
    }

    componentRender(p: any, s: any, l: ISODownloadComponentLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <StaticDrawerMenu body={() => (
                <Flex fw elements={[
                    <DrawerHeader
                        header={"ISO-image burner"}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"VFS-ISO"}
                        description={"Download a freshly generate ISO-image of the current Atlas™-state.\n\n*Tip: Atlas-ISO-Images are in JSON-format, which makes them human-readable & easily processable. You can for example inspect the ISO by opening it in a browser window.*"}
                        margin={createMargin(0, 0, 40, 0)}
                    />,

                    <QueryDisplay<ISOBase | undefined> q={local.state.iso} renderer={{
                        success: (q, data) => {
                            const timestamp = new Date().toISOString();
                            return (
                                <Flex fw elements={[
                                    <Flex fw padding paddingX={px(25)} gap={t.gaps.smallGab} elements={[
                                        <FlexRow fw gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                                            <Button tooltip={"Close"} opaque children={
                                                <Icon icon={<CloseRounded/>}/>
                                            }/>,
                                            <Button tooltip={"View source"} visualMeaning={VM.BETA} opaque children={
                                                <Icon icon={<CodeRounded/>}/>
                                            } onClick={() => {
                                                this.dialog(
                                                    <Screen children={
                                                        <Flex align={Align.CENTER} fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                                                            Badge.badge("Development", {
                                                                visualMeaning: ObjectVisualMeaning.BETA
                                                            }),
                                                            <CodeDisplay code={JSON.stringify(as<ISOBase>({
                                                                ...data!,
                                                                title: this.ls().fileTitleAppendix,
                                                                description: this.ls().isoDescription
                                                            }), null, 2).split("\n")}/>
                                                        ]}/>
                                                    }/>
                                                )
                                            }}/>,
                                            <Button shrinkOnClick width={percent(100)} visualMeaning={VM.INFO} opaque children={
                                                <Icon icon={<Download/>}/>
                                            } onClick={() => {
                                                const appendix = this.getAppendix();
                                                const useAppendix = appendix.length > 0;
                                                const ls = this.ls();
                                                data!.title = ls.fileTitleAppendix;
                                                data!.description = ls.isoDescription;
                                                const iso = JSON.stringify(data);
                                                fileDownload(iso, `${!useAppendix ? "" : `${appendix}-`}iso-${timestamp}.atlas`);
                                            }}/>
                                        ]}/>,

                                        <Flex margin={createMargin(25, 0, 0, 0)} fw gap={px()} elements={[
                                            <Text text={"Optional information"} bold/>,
                                            <Text text={"Provide additional information about the image. "} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                        ]}/>,

                                        <Input placeholder={"Title"} defaultValue={this.ls().fileTitleAppendix} onChange={ev => {
                                            this.local.setState({
                                                fileTitleAppendix: ev.target.value.trim()
                                            });
                                        }}/>,
                                        <TextArea label={"Description"} defaultValue={this.ls().isoDescription} placeholder={"Description"} onChange={ev => {
                                            this.local.setState({
                                                isoDescription: ev.target.value.trim()
                                            });
                                        }}/>,

                                        <Flex margin={createMargin(25, 0, 0, 0)} fw gap={px()} elements={[
                                            <Text text={"Format"} bold/>,
                                            <Text text={"Choose a file format for the Atlas™-ISO-image-file"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                                        ]}/>,

                                        this.component(ls => (
                                            <ToggleButtonGroup
                                                value={ls.state.fileFormat}
                                                exclusive
                                                fullWidth
                                                onChange={(event, value) => {
                                                    this.local.setStateWithChannels({
                                                        fileFormat: value
                                                    }, ["file-format"]);
                                                }}
                                                sx={{
                                                    borderRadius: t.radii.defaultObjectRadius.css(),
                                                    ".Mui-selected": {
                                                        backgroundColor: t.colors.primaryHighlightColor.withAlpha(t.alpha.opaqueUI).css(),
                                                        "*": {
                                                            color: t.colors.primaryHighlightColor.css()
                                                        },
                                                        "&:hover": {
                                                            backgroundColor: t.colors.primaryHighlightColor.withAlpha(t.alpha.opaqueUI).css(),
                                                        }
                                                    },
                                                    "*": {
                                                        borderColor: `${t.colors.borderPrimaryColor.css()} !important`,
                                                    }
                                                }}
                                            >
                                                <ToggleButton fullWidth value="atlas" children={
                                                    <Description cursor={Cursor.pointer} renderMarkdown={false} text={"Atlas"}/>
                                                }/>
                                                <ToggleButton fullWidth value="json" children={
                                                    <Description cursor={Cursor.pointer} renderMarkdown={false} text={"Json"}/>
                                                }/>
                                            </ToggleButtonGroup>
                                        ), "file-format"),


                                        // <Button
                                        //     width={percent(100)}
                                        //     onClick={() => fileDownload(iso, jsonFilename)}
                                        //     children={
                                        //         <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                        //             <Flex fw align={Align.CENTER} margin={createMargin(0, 0, t.gaps.smallGab.measurand, 0)} elements={[
                                        //                 Badge.badge("Recommended", {
                                        //                     visualMeaning: ObjectVisualMeaning.BETA
                                        //                 }),
                                        //             ]}/>,
                                        //             <Text
                                        //                 bold
                                        //                 text={"Download json ISO-image"}
                                        //             />,
                                        //             <Text
                                        //                 text={`${jsonFilename}`}
                                        //                 type={TextType.secondaryDescription}
                                        //                 fontSize={px(11)}
                                        //                 align={Align.CENTER}
                                        //             />
                                        //         ]}/>
                                        //     }
                                        // />,
                                        // <Button
                                        //     width={percent(100)}
                                        //     onClick={() => fileDownload(iso, atlasFilename)}
                                        //     children={
                                        //         <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                        //             <Text
                                        //                 bold
                                        //                 text={"Download atlas ISO-image"}
                                        //             />,
                                        //             <Text
                                        //                 text={`${atlasFilename}`}
                                        //                 type={TextType.secondaryDescription}
                                        //                 fontSize={px(11)}
                                        //                 align={Align.CENTER}
                                        //             />
                                        //         ]}/>
                                        //     }
                                        // >
                                    ]}/>,
                                ]}/>
                            );
                        },
                        processing: q => {
                            // TODO: Make better loading screen / visual
                            return (
                                <InformationBox width={percent(100)} visualMeaning={VM.UI_NO_HIGHLIGHT} children={
                                    <Description renderMarkdown={false} text={`Loading ISO image`}/>
                                }/>
                            );
                        },
                        error(q: Queryable<ISOBase | undefined>, error?: QueryError): JSX.Element {
                            return (
                                <InformationBox width={percent(100)} visualMeaning={VM.ERROR} children={
                                    <Description text={`**Code ${error?.code}**; ${error?.object}`}/>
                                }/>
                            );
                        }
                    }}/>
                ]}/>
            )}/>
        ), ...Q.allChannels("iso"))
    }
}
