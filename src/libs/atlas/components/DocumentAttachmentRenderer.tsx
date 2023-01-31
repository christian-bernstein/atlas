import {BC} from "../../base/BernieComponent";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Themeable} from "../../base/logic/style/Themeable";
import {Q, Queryable} from "../../base/logic/query/Queryable";
import {DBDocumentAttachment} from "../data/db/DBDocumentAttachment";
import {AtlasMain} from "../AtlasMain";
import {QueryDisplay} from "../../base/components/logic/QueryDisplay";
import {QueryError} from "../../base/logic/query/QueryError";
import {Flex, FlexBox} from "../../base/components/base/FlexBox";
import {Icon} from "../../base/components/base/Icon";
import {ReactComponent as AttachmentIcon} from "../../../assets/icons/ic-20/ic20-attachment.svg";
import {Button} from "../../base/components/base/Button";
import React from "react";
import {ObjectVisualMeaning} from "../../base/logic/style/ObjectVisualMeaning";
import {StaticDrawerMenu} from "../../base/components/base/StaticDrawerMenu";
import {Screen} from "../../base/components/base/Page";
import {Box} from "../../base/components/base/Box";
import {percent} from "../../base/logic/style/DimensionalMeasured";
import {Align} from "../../base/logic/style/Align";
import {Justify} from "../../base/logic/style/Justify";
import {AnomalyInfo} from "../../base/components/base/AnomalyInfo";
import {OverflowBehaviour} from "../../base/logic/style/OverflowBehaviour";
import {PuffLoader} from "react-spinners";
import {Text} from "../../base/components/base/Text";

export type DocumentAttachmentRendererProps = {
    attachmentID: string,
    fullscreen?: boolean
}

export type DocumentAttachmentRendererLocalState = {
    data: Q<DBDocumentAttachment | undefined>
}

export class DocumentAttachmentRenderer extends BC<DocumentAttachmentRendererProps, any, DocumentAttachmentRendererLocalState> {

    constructor(props: DocumentAttachmentRendererProps) {
        super(props, undefined, {
            data: new Queryable<DBDocumentAttachment | undefined>({
                listeners: ["data"],
                fallback: undefined,
                component: () => this,
                process: (resolve, reject) => {
                    AtlasMain.atlas().api().persistentDB().documentAttachments.where("id").equals(props.attachmentID).toArray().then((arr: Array<DBDocumentAttachment>) => {
                        if (arr.length > 0) {
                            resolve(arr[0])
                        } else {
                            reject();
                        }
                    }).catch(reason => reject(reason));
                }
            })
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.data.query();
    }

    componentRender(p: DocumentAttachmentRendererProps, s: any, l: DocumentAttachmentRendererLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <QueryDisplay<DBDocumentAttachment | undefined> q={local.state.data} renderer={{
                success: (q, data) => {
                    return (
                        <Flex fw style={{ position: "relative" }} elements={[
                            <Box noPadding overflowYBehaviour={OverflowBehaviour.HIDDEN} overflowXBehaviour={OverflowBehaviour.HIDDEN} width={percent(100)} children={
                                <img width={"100%"} src={`${data?.src}`} alt={"image attachment"} onClick={() => {
                                    this.dialog(
                                        <Screen onDoubleClick={() => this.closeLocalDialog()} style={{ backgroundColor: "#000000" }} deactivatePadding children={
                                            <Flex fw fh style={{ position: "relative" }} elements={[
                                                <Flex fh fw align={Align.CENTER} justifyContent={Justify.CENTER} children={
                                                    <DocumentAttachmentRenderer attachmentID={p.attachmentID} fullscreen/>
                                                }/>
                                            ]}/>
                                        }/>
                                    )
                                }}/>
                            }/>,
                            <Button border={false} opaque bgColorOnDefault={false} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} style={{ position: "absolute", top: t.gaps.smallGab.measurand, right: t.gaps.smallGab.measurand }} children={
                                <Icon icon={<AttachmentIcon/>}/>
                            } onClick={() => {
                                this.dialog(
                                    <StaticDrawerMenu body={props => (
                                        <Flex elements={[
                                            <Button text={"share"} onClick={() => {
                                                const file = new File([new Blob([data?.src as string], {
                                                    type: "image/png"
                                                })], "image.png", {
                                                    type: "image/png"
                                                });

                                                if (navigator.canShare({ files: [file] })) {
                                                    navigator.share({
                                                        title: "share an attachment",
                                                        text: "share this attachment..",
                                                        files: [new File([new Blob([data?.src as string], {
                                                            type: "text/plain"
                                                        })], "image.png")]
                                                    }).then(r => console.log(r))
                                                } else {
                                                    this.dialog(
                                                        <AnomalyInfo anomaly={{
                                                            description: "No sharing"
                                                        }}/>
                                                    )
                                                }
                                            }}/>,

                                            <Button text={"delete"} onClick={() => {
                                                AtlasMain.atlas().api().persistentDB().documentAttachments.delete(p.attachmentID).then(() => {


                                                    // TODO: Not working correctly
                                                    AtlasMain.atlas().api().updateDocument(p.attachmentID, document => {
                                                        let iDs: Array<string> | undefined = document.attachmentIDs;
                                                        if (iDs === undefined) {
                                                            iDs = [];
                                                        }
                                                        document.attachmentIDs = iDs.filter(id => p.attachmentID !== id);
                                                        return document;
                                                    });
                                                });
                                            }}/>
                                        ]}/>
                                    )}/>
                                );
                            }}/>
                        ]}/>
                    );
                },
                error(q: Queryable<DBDocumentAttachment | undefined>, error?: QueryError): JSX.Element {
                    return <>error</>
                },
                processing(q: Queryable<DBDocumentAttachment | undefined>): JSX.Element {
                    return (
                        <Box children={
                            <FlexBox gap={t.gaps.defaultGab} align={Align.CENTER} justifyContent={Justify.CENTER}>
                                <PuffLoader color={t.colors.warnHighlightColor.css()}/>
                                <Text text={"Loading attachment"} bold uppercase coloredText visualMeaning={ObjectVisualMeaning.WARNING}/>
                            </FlexBox>
                        }/>
                    );
                },
                neural(q: Queryable<DBDocumentAttachment | undefined>): JSX.Element {
                    return <>neutral</>
                }
            }}/>
        ), ...Q.allChannels("data"))
    }
}
