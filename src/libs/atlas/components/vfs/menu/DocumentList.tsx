import {BC, BernieComponent} from "../../../../base/BernieComponent";
import {AtlasDocument} from "../../../data/AtlasDocument";
import {Themeable} from "../../../../base/logic/style/Themeable";
import {Assembly} from "../../../../base/logic/assembly/Assembly";
import {SettingsGroup} from "../../../../base/components/base/SettingsGroup";
import {SettingsElement} from "../../../../base/components/base/SettingsElement";
import {Icon} from "../../../../base/components/base/Icon";
import {ReactComponent as ActionsIcon} from "../../../../../assets/icons/ic-20/ic20-more-ver.svg";
import {percent, px} from "../../../../base/logic/style/DimensionalMeasured";
import {StaticDrawerMenu} from "../../../../base/components/base/StaticDrawerMenu";
import {Flex} from "../../../../base/components/base/FlexBox";
import {Align} from "../../../../base/logic/style/Align";
import {ReactComponent as DeleteIcon} from "../../../../../assets/icons/ic-20/ic20-delete.svg";
import {ObjectVisualMeaning, VM} from "../../../../base/logic/style/ObjectVisualMeaning";
import {AtlasMain} from "../../../AtlasMain";
import {ConfirmationDialog} from "../../../../base/components/base/ConfirmationDialog";
import {DocumentComponent} from "../../DocumentComponent";
import {FlexDirection} from "../../../../base/logic/style/FlexDirection";
import {Badge} from "../../../../base/components/base/Badge";
import {UnresolvedDocumentComponent} from "../../UnresolvedDocumentComponent";
import {Justify} from "../../../../base/logic/style/Justify";
import {Text, TextType} from "../../../../base/components/base/Text";
import {Dot} from "../../../../base/components/base/Dot";
import {Tooltip} from "../../../../base/components/base/Tooltip";
import {ReactComponent as CreateIcon} from "../../../../../assets/icons/ic-20/ic20-edit.svg";
import {AF} from "../../../../base/components/logic/ArrayFragment";
import {createMargin} from "../../../../base/logic/style/Margin";
import {Cursor} from "../../../../base/logic/style/Cursor";
import React from "react";
import {VFSFolderView} from "../../VFSFolderView";
import {InformationBox} from "../../../../base/components/base/InformationBox";
import {Description} from "../../../../base/components/base/Description";
import {EntityImportDialog} from "../../EntityImportDialog";
import {ImportExportRounded} from "@mui/icons-material";

export type DocumentListProps = {
    documents: Array<AtlasDocument>
}

export class DocumentList extends BernieComponent<DocumentListProps, any, any> {

    init() {
        super.init();
        this.noVFSViewFallbackAssembly();
        this.mainAssembly();
    }

    private noVFSViewFallbackAssembly() {
        this.assembly.assembly("no-vfs-view-fallback", (theme) => {
            return (
                <InformationBox visualMeaning={VM.ERROR} width={percent(100)} children={
                    <Description text={"Cannot render DocumentList-component, because VFSFolderView isn't active"}/>
                }/>
            );
        })
    }

    private renderDocuments(docs: Array<AtlasDocument>, theme: Themeable.Theme, view: VFSFolderView, emptyRenderer?: () => JSX.Element): JSX.Element {
        if (docs.length > 0) {
            return (
                <SettingsGroup elements={
                    docs.map(doc => {
                        return this.component(local => {
                            const contextMenuRenderer = (element: SettingsElement) => {
                                return (
                                    <Icon coloredOnDefault={false} uiNoHighlightOnDefault icon={<ActionsIcon/>} tooltip={"Actions"} size={px(18)} onClick={(event) => {
                                        // TODO: Handle -> Open context menu (Improve menu)

                                        element.dialog(
                                            <StaticDrawerMenu body={() => (
                                                <Flex align={Align.CENTER} fh fw elements={[
                                                    <SettingsElement groupDisplayMode title={"Delete document"} iconConfig={{
                                                        enable: true,
                                                        color: theme.colors.errorColor,
                                                        iconGenerator: element => <DeleteIcon/>
                                                    }} onClick={element => {
                                                        element.helper.confirm({
                                                            title: `Delete document ${doc.title}`,
                                                            vm: ObjectVisualMeaning.ERROR,
                                                            text: "This action cannot be undone. Once the document is deleted, it is removed unrecoverable from the system.\n**It is recommended to create recoverable backups via the ISO-image manager**.",
                                                            actions: {
                                                                onConfirm: (component: BC<any, any, any>) => {
                                                                    AtlasMain.atlas(atlas => {
                                                                        if (atlas.api().deleteDocument(doc.id)) {
                                                                            view.local.state.viewMultiplexers.forEach(mux => {
                                                                                view.closeAndRemoveDocumentFromMultiplexer(mux.groupID, doc.id);
                                                                            })

                                                                            // TODO: Make better version
                                                                            view.reloadFolderView();
                                                                            this.rerender("document-view", view.toDocumentSpecificChannel(doc.id, "meta-updated"));

                                                                        }
                                                                    });
                                                                },
                                                                onCancel(component: BernieComponent<any, any, any>) {
                                                                    component.closeLocalDialog();
                                                                }
                                                            }
                                                        }, (config, caller) => <ConfirmationDialog config={config} caller={caller}/>)
                                                    }}/>
                                                ]}/>
                                            )}/>
                                        );

                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}/>
                                );
                            }

                            try {
                                if (view.isDocumentOpened(doc.id)) {
                                    // Document is opened in a multiplexer, Display visual hint
                                    return (
                                        <DocumentComponent data={doc} onSelect={(element, data) => "open-local-document-view"} appendix={element => (
                                            <Flex flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab} align={Align.CENTER} elements={[
                                                Badge.badge("Open", {
                                                    visualMeaning: ObjectVisualMeaning.INFO
                                                }),
                                                contextMenuRenderer(element)
                                            ]}/>
                                        )}/>
                                    );
                                } else {
                                    return (
                                        <DocumentComponent data={doc} onSelect={(element, data) => {
                                            view.openDocument(data);
                                            return "break";
                                        }} appendix={element => (
                                            <Flex flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab} align={Align.CENTER} elements={[
                                                contextMenuRenderer(element)
                                            ]}/>
                                        )}/>
                                    );
                                }
                            } catch (e) {
                                return (
                                    <UnresolvedDocumentComponent id={doc.id} error={e}/>
                                );
                            }
                        }, ...["opened", "closed", "meta-updated"].map(channel => view.toDocumentSpecificChannel(doc.id, channel)));
                    })
                }/>
            );
        }
        return emptyRenderer === undefined ? <></> : emptyRenderer();
    }

    private mainAssembly() {
        this.assembly.assembly("main", (theme, view: VFSFolderView) => {
            type ADA = Array<AtlasDocument>;
            const documents: ADA = view.getDocumentsInCurrentFolder();
            const pinnedDocuments: ADA = documents.filter(doc => doc.pinned ?? false);
            const unpinnedDocuments: ADA = documents.filter(doc => !(doc.pinned ?? false));

            return (
                <Flex fw elements={[
                    <Flex fw elements={[
                        <Flex fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                <Text text={"Documents"} bold/>,
                                <Dot/>,
                                <Text text={`${documents.length}`} type={TextType.secondaryDescription}/>,
                            ]}/>,

                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                                <Tooltip title={"Create document"} arrow children={
                                    <Icon icon={<CreateIcon/>} size={px(16)} onClick={() => view.openCreateBlankDocumentSetup()}/>
                                }/>
                            ]}/>,
                        ]}/>,

                        documents.length > 0 ? (
                            <AF elements={[
                                this.renderDocuments(pinnedDocuments, theme, view, undefined),
                                this.renderDocuments(unpinnedDocuments, theme, view,undefined),
                            ]}/>
                        ) : (
                            <Flex margin={createMargin(20, 0, 20, 0)} fw align={Align.CENTER} justifyContent={Justify.CENTER} gap={px()} elements={[
                                <Text
                                    text={"Empty"}
                                    type={TextType.secondaryDescription}
                                    bold
                                />,
                                <Text
                                    text={"Create document"}
                                    fontSize={px(11)}
                                    cursor={Cursor.pointer}
                                    highlight
                                    coloredText
                                    visualMeaning={VM.INFO}
                                    type={TextType.secondaryDescription}
                                    onClick={() => view.openCreateBlankDocumentSetup()}
                                />
                            ]}/>
                        )
                    ]}/>
                ]}/>
            );
        });
    }

    componentRender(p: DocumentListProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const view = AtlasMain.atlas().ls().vfsFolderViewInstance;
        if (view === undefined) return this.a("no-vfs-view-fallback");
        return this.a("main", view);
    }
}
