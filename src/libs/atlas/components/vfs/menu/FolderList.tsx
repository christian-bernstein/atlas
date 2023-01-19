import {BernieComponent} from "../../../../base/BernieComponent";
import {Assembly} from "../../../../base/logic/assembly/Assembly";
import {Themeable} from "../../../../base/logic/style/Themeable";
import {Folder} from "../../../data/Folder";
import {AtlasMain} from "../../../AtlasMain";
import {Flex} from "../../../../base/components/base/FlexBox";
import {FlexDirection} from "../../../../base/logic/style/FlexDirection";
import {Align} from "../../../../base/logic/style/Align";
import {Justify} from "../../../../base/logic/style/Justify";
import {Text, TextType} from "../../../../base/components/base/Text";
import {Dot} from "../../../../base/components/base/Dot";
import {Tooltip} from "../../../../base/components/base/Tooltip";
import {Icon} from "../../../../base/components/base/Icon";
import {ReactComponent as CreateIcon} from "../../../../../assets/icons/ic-20/ic20-edit.svg";
import {percent, px} from "../../../../base/logic/style/DimensionalMeasured";
import {SettingsGroup} from "../../../../base/components/base/SettingsGroup";
import {FolderComponent} from "../../FolderComponent";
import {createMargin} from "../../../../base/logic/style/Margin";
import {Cursor} from "../../../../base/logic/style/Cursor";
import {ObjectVisualMeaning, VM} from "../../../../base/logic/style/ObjectVisualMeaning";
import React from "react";
import {VFSFolderView} from "../../VFSFolderView";
import {InformationBox} from "../../../../base/components/base/InformationBox";
import {Description} from "../../../../base/components/base/Description";
import {AF} from "../../../../base/components/logic/ArrayFragment";
import {Checkbox} from "@mui/material";

export type FolderListProps = {
    folders: Array<Folder>
}

export type FolderListLocalState = {
    selectionMode: boolean,
    selectedFolders: Array<string>
}

export class FolderList extends BernieComponent<FolderListProps, any, FolderListLocalState> {

    constructor(props: FolderListProps) {
        super(props, undefined, {
            selectionMode: false,
            selectedFolders: []
        });
    }

    init() {
        super.init();
        this.noVFSViewFallbackAssembly();
        this.mainAssembly();
        this.headerAssembly();
    }

    private toggleSelectionMode() {
        this.local.setStateWithChannels({
            selectionMode: !this.ls().selectionMode
        }, ["selection-state"])
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

    private renderFolders(folders: Array<Folder>, view: VFSFolderView): JSX.Element {
        if (folders.length === 0) return <></>;
        const ls = this.ls();
        return (
            <SettingsGroup elements={
                folders.map(folder => {
                    const selected = ls.selectionMode ? ls.selectedFolders.includes(folder.id) : false;
                    return (
                        <FolderComponent inSelectionMode={ls.selectionMode} selected={selected} renderDetails={false} data={folder} onSelect={(component, data) => new Promise<void>((resolve, reject) => {

                            if (this.ls().selectionMode) {

                                let selected = this.ls().selectedFolders;
                                if (selected.includes(folder.id)) {
                                    selected.filter(id => id !== folder.id);
                                } else {
                                    selected.push(folder.id);
                                }
                                this.local.setStateWithChannels({
                                    selectedFolders: selected
                                }, ["selection-state"])

                                return;
                            }



                            view.local.setState({
                                currentFolderID: data.id
                            }, new Map<string, any>(), () => {
                                view.reloadFolderView();
                            });
                        })}/>
                    );
                })
            }/>
        );
    }

    private headerAssembly() {
        this.assembly.assembly("header", (theme, view: VFSFolderView) => {
            const folders = this.props.folders;
            const ls = this.ls();
            const allFoldersChecked = ls.selectedFolders.length === folders.length;
            const someFoldersChecked = ls.selectedFolders.length > 0;

            if (ls.selectionMode) {
                return (
                    <Flex fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                            <Checkbox indeterminate={!allFoldersChecked ? someFoldersChecked : undefined} checked={allFoldersChecked} size={"small"} sx={{ padding: "0", ".MuiSvgIcon-root ": {
                                // fill: `${theme.colors.primaryColor.css()} !important`
                                    fill: `white !important`
                            }}}/>,

                            <Text text={"Select"} bold/>,
                            <Dot/>,
                            <Text text={`${ls.selectedFolders.length} selected`} type={TextType.secondaryDescription}/>,
                        ]}/>,

                        <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                            <Description text={"Cancel"} highlight visualMeaning={VM.INFO} cursor={Cursor.pointer} onClick={() => this.toggleSelectionMode()}/>,
                        ]}/>,
                    ]}/>
                );
            }

            return (
                <Flex fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                    <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                        <Text text={"Folders"} bold/>,
                        <Dot/>,
                        <Text text={`${folders.length}`} type={TextType.secondaryDescription}/>,
                    ]}/>,

                    <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                        <Description text={"Select"} highlight visualMeaning={VM.INFO} cursor={Cursor.pointer} onClick={() => this.toggleSelectionMode()}/>,
                        <Tooltip title={"Create folder"} arrow children={
                            <Icon icon={<CreateIcon/>} size={px(16)} onClick={() => view.openCreateFolderSetup()}/>
                        }/>
                    ]}/>,
                ]}/>
            );
        })
    }

    private mainAssembly() {
        this.assembly.assembly("main", (theme, view: VFSFolderView) => {
            type FolderArray = Array<Folder>;
            const folders = this.props.folders;
            const pinnedSubFolders: FolderArray = folders.filter(folder => folder.pinned ?? false);
            const unpinnedSubFolders: FolderArray = folders.filter(folder => !(folder.pinned ?? false));


            return (
                <Flex fw elements={[
                    <Flex fw elements={[
                        this.component(() => this.a("header", view), "selection-state"),

                        folders.length > 0 ? (
                            this.component(() => (
                                <AF elements={[
                                    this.renderFolders(pinnedSubFolders, view),
                                    this.renderFolders(unpinnedSubFolders, view),
                                ]}/>
                            ), "selection-state")
                        ) : (
                            <Flex margin={createMargin(20, 0, 20, 0)} fw align={Align.CENTER} justifyContent={Justify.CENTER} gap={px()} elements={[
                                <Text
                                    text={"Empty"}
                                    // fontSize={px(11)}
                                    type={TextType.secondaryDescription}
                                    bold
                                />,
                                <Text
                                    text={"Create folder"}
                                    fontSize={px(11)}
                                    cursor={Cursor.pointer}
                                    highlight
                                    coloredText
                                    visualMeaning={VM.INFO}
                                    type={TextType.secondaryDescription}
                                    onClick={() => view.openCreateFolderSetup()}
                                />
                            ]}/>
                        )
                    ]}/>,
                ]}/>
            );
        });
    }

    componentRender(p: FolderListProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const view = AtlasMain.atlas().ls().vfsFolderViewInstance;
        if (view === undefined) return this.a("no-vfs-view-fallback");
        return this.a("main", view);
    }
}
