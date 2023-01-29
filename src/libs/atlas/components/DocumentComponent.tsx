import {BC} from "../../base/BernieComponent";
import {Themeable} from "../../base/logic/style/Themeable";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {AtlasDocument} from "../data/AtlasDocument";
import {SettingsElement} from "../../base/components/base/SettingsElement";
import {getOr} from "../../base/Utils";
import {StaticDrawerMenu} from "../../base/components/base/StaticDrawerMenu";
import {DocumentPreview} from "./DocumentPreview";
import {AtlasMain} from "../AtlasMain";
import {percent, px} from "../../base/logic/style/DimensionalMeasured";
import {Color} from "../../base/logic/style/Color";
import {FlexRow} from "../../base/components/base/FlexBox";
import {Align} from "../../base/logic/style/Align";
import {If} from "../../base/components/logic/If";
import {Icon} from "../../base/components/base/Icon";
import {StarRounded} from "@mui/icons-material";
import React from "react";
import {Description} from "../../base/components/base/Description";
import {Cursor} from "../../base/logic/style/Cursor";

export type DocumentComponentProps = {
    data: AtlasDocument
    onSelect?: (element: SettingsElement, data: AtlasDocument) => "break" | "open-local-document-view",
    appendix?: ((element: SettingsElement) => JSX.Element) | undefined
}

export type DocumentComponentLocalState = {
    data: AtlasDocument
}

export class DocumentComponent extends BC<DocumentComponentProps, any, DocumentComponentLocalState> {

    constructor(props: DocumentComponentProps) {
        super(props, undefined, {
            data: props.data
        });
    }

    init() {
        super.init();
        this.appendixAssembly();
        this.pinnedAssembly();
    }

    private getDocumentData(refresh: boolean = false): AtlasDocument {
        if (refresh) {
            AtlasMain.atlas(atlas => {
                this.local.setStateWithChannels({
                    data: atlas.api().getDocument(this.props.data.id)
                }, ["document-data-refresh"]);
            });
        }
        return this.local.state.data;
    }

    private onClick(element: SettingsElement): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const refreshedData = this.getDocumentData(true);
                if (this.props.onSelect?.(element, refreshedData) === "open-local-document-view") {
                    this.dialog(
                        <StaticDrawerMenu maxHeight={percent(85)} body={() => (
                            <DocumentPreview data={refreshedData}/>
                        )}/>
                    );
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    private onClickTogglePinnedFlagIcon(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        this.togglePinnedFlag();
    }

    private togglePinnedFlag() {
        AtlasMain.atlas(atlas => {
            atlas.api()?.updateDocument(this.ls().data.id, document => {
                document.pinned = document.pinned === undefined ? true : !document.pinned
                return document;
            });

            atlas.useVFSFolderView(view => {
                view.rerender("document-view");
            }, () => {
                // TODO: VFS not opened
                console.error("Cannot rerender 'document-view' in VFSFolderView, because VFSFolderView isn't opened.");
            })
        });
    }

    private pinnedAssembly() {
        this.assembly.assembly("pinned", (theme, element: SettingsElement) => {
            const isPinned = this.ls().data.pinned ?? false;
            return (
                <FlexRow align={Align.CENTER} elements={[
                    <If condition={isPinned} ifTrue={
                        <Icon
                            // tooltip={"Unpin"}
                            icon={<StarRounded/>}
                            onClick={(event) => this.onClickTogglePinnedFlagIcon(event)}
                        />
                    } ifFalse={
                        <Icon
                            // tooltip={"Pin"}
                            icon={<StarRounded/>}
                            uiNoHighlightOnDefault
                            coloredOnDefault={false}
                            onClick={(event) => this.onClickTogglePinnedFlagIcon(event)}
                        />
                    }/>
                ]}/>
            );
        })
    }

    private appendixAssembly() {
        this.assembly.assembly("appendix", (theme, element: SettingsElement) => {
            return (
                <FlexRow align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                    this.props.appendix?.(element) ?? <></>,
                    this.a("pinned")
                ]}/>
            );
        })
    }

    // TODO: Replace with own implementation -> No SettingsElement -> Something with the icon hit box is off while using SettingsElement appendix
    componentRender(p: DocumentComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <SettingsElement
                groupDisplayMode
                forceRenderSubpageIcon
                title={""}
                alternateTitleRenderer={element => {
                    return (
                        <Description renderMarkdown={false} text={getOr(p.data.title, "N/A")}/>
                    );
                }}
                iconConfig={{
                    enable: true,
                    color: p.data.iconColorHEX === undefined ? undefined : Color.ofHex(p.data.iconColorHEX),
                    iconGenerator: element => AtlasMain.atlas().getIconFromLookup(p.data.icon ?? { dict: "atlas", id: "generic-file" })
                }}
                promiseBasedOnClick={element => this.onClick(element)}
                appendixGenerator={element => this.a("appendix", element)}
            />
        );
    }
}
