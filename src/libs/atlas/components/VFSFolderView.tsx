import {BC} from "../../base/BernieComponent";
import {Themeable} from "../../base/logic/style/Themeable";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Screen} from "../../base/components/base/Page";
import {Flex, FlexRow} from "../../base/components/base/FlexBox";
import {FlexDirection} from "../../base/logic/style/FlexDirection";
import {Text, TextType} from "../../base/components/base/Text";
import {percent, px, vw} from "../../base/logic/style/DimensionalMeasured";
import {ReactComponent as SettingsIcon} from "../../../assets/icons/ic-20/ic20-settings.svg";
import {ReactComponent as EditIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {Icon} from "../../base/components/base/Icon";
import {Justify} from "../../base/logic/style/Justify";
import {Align} from "../../base/logic/style/Align";
import {SettingsGroup} from "../../base/components/base/SettingsGroup";
import {DrawerHeader} from "../../base/components/base/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../base/logic/style/ObjectVisualMeaning";
import {OverflowBehaviour} from "../../base/logic/style/OverflowBehaviour";
import {FlexWrap} from "../../base/logic/style/FlexWrap";
import {Box} from "../../base/components/base/Box";
import {Cursor} from "../../base/logic/style/Cursor";
import React from "react";
import {OverflowWithHeader} from "../../base/components/base/OverflowWithHeader";
import {ReactComponent as AttachmentIcon} from "../../../assets/icons/ic-20/ic20-attachment.svg";
import {AtlasMain} from "../AtlasMain";
import {Q, Queryable} from "../../base/logic/query/Queryable";
import {Folder} from "../data/Folder";
import {QueryDisplay} from "../../base/components/logic/QueryDisplay";
import {FolderSetupDialog} from "./FolderSetupDialog";
import {AF} from "../../base/components/logic/ArrayFragment";
import {createMargin} from "../../base/logic/style/Margin";
import {StaticDrawerMenu} from "../../base/components/base/StaticDrawerMenu";
import {AtlasDocument} from "../data/AtlasDocument";
import {IAtlasAPI} from "../api/IAtlasAPI";
import {DocumentCreateWizard} from "./DocumentCreateWizard";
import {DocumentViewMultiplexer, DocumentViewMultiplexerControlConfig} from "./DocumentViewMultiplexer";
import {v4} from "uuid";
import {LiteGrid} from "../../base/components/base/LiteGrid";
import {SettingsElement} from "../../base/components/base/SettingsElement";
import {Separator} from "../../base/components/base/Separator";
import {Orientation} from "../../base/logic/style/Orientation";
import {DocumentState} from "../data/DocumentState";
import _ from "lodash";
import {DocumentSaveState} from "../data/DocumentSaveState";
import {FolderPathView} from "./FolderPathView";
import {SideMenu} from "./SideMenu";
import {DocumentList} from "./vfs/menu/DocumentList";
import {VFSFolderViewFilterState} from "../data/vfs/VFSFolderViewFilterState";
import {UnaryFunction} from "../utils/UnaryFunction";
import {Input} from "../../base/components/base/Input";
import {If} from "../../base/components/logic/If";
import {DeleteRounded, UploadRounded} from "@mui/icons-material";
import {FolderList} from "./vfs/menu/FolderList";
import {Default, Mobile} from "../../base/components/logic/Media";
import {isMobile} from 'react-device-detect';
import {DocumentViewController} from "../documentViews/DocumentViewController";
import {VFSSettings} from "../data/vfs/VFSSettings";
import {HyperionAPI} from "../hyperion/HyperionAPI";
import {UpstreamTransactionType} from "../hyperion/UpstreamTransactionType";
import {Optional} from "../../base/Optional";
import {Centered} from "../../base/components/base/PosInCenter";
import {Description} from "../../base/components/base/Description";
import {AtlasLogo} from "./branding/AtlasLogo";
import {EntityImportDialog} from "./EntityImportDialog";
import {Button} from "../../base/components/base/Button";
import {Dot} from "../../base/components/base/Dot";
import Slide from '@mui/material/Slide';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Collapse from '@mui/material/Collapse';
import {TransitionGroup} from "react-transition-group";
import {DocumentType} from "../data/DocumentType";
import {StorageInformationPanel} from "./panels/StorageInformationPanel";
import {HOCWrapper} from "../../base/components/HOCWrapper";

export type VFSFolderViewProps = {
    initialFolderID?: string,
    onClose: () => void,
    onMount?: (view: VFSFolderView) => void
}

export type VFSFolderViewLocalState = {
    currentFolderData: Q<Folder | undefined>
    currentFolderID?: string,
    viewMultiplexers: Array<DocumentViewMultiplexerControlConfig>,
    documentStates: Map<string, DocumentState>;
    documentBodyUpdaters: Map<string, (body: string) => void>,
    menuVisible: boolean,
    filterState: VFSFolderViewFilterState,
    debouncedTitleFilterUpdater: (newTitleFilterValue: string) => void,
    vfsSettings: Q<Optional<VFSSettings>>,
    animateFolderSlider: boolean,
    folderSliderAnimationDirection: "right" | "left" | "up" | "down" | undefined
}

export class VFSFolderView extends BC<VFSFolderViewProps, any, VFSFolderViewLocalState> {

    public static readonly HYPERION_SETTINGS_ADDRESS: string = "vfs-settings";

    private static readonly GENERIC_LOADING_INTERRUPT_CHANNEL: string = "generic-loading-interrupt-channel";

    constructor(props: VFSFolderViewProps) {
        super(props, undefined, {
            animateFolderSlider: false,
            folderSliderAnimationDirection: undefined,
            menuVisible: true,
            documentStates: new Map<string, DocumentState>(),
            documentBodyUpdaters: new Map<string, (body: string) => void>(),
            currentFolderID: props.initialFolderID ?? "root",
            filterState: {},
            debouncedTitleFilterUpdater: _.debounce((newTitleFilterValue: string) => {
                this.updateSearchFilter(property => {
                    property.titleFilter = newTitleFilterValue;
                    return property;
                });
            }, 1000),
            currentFolderData: new Queryable<Folder | undefined>({
                component: () => this,
                listeners: ["current-folder"],
                fallback: undefined,
                process: (resolve, reject) => {
                    const rootFolderID: string = this.local.state.currentFolderID ?? props.initialFolderID ?? "root";
                    let currentFolder: Folder | undefined = AtlasMain.atlas().api().getFolder(rootFolderID);

                    if (currentFolder === undefined) {
                        currentFolder = {
                            categories: new Array<string>(),
                            title: "root",
                            id: "root",
                            description: "All your folders at-a-glance\nPress on the context icon to see available actions, like creating folders or accessing ISO-image manager",
                            tags: ["internal"]
                        }
                        if (AtlasMain.atlas().api().createFolder(currentFolder)) {
                            resolve(currentFolder);
                        } else {
                            reject();
                        }
                    } else {
                        resolve(currentFolder);
                    }
                }
            }),
            vfsSettings: new Queryable<VFSSettings | undefined>({
                component: () => this,
                listeners: [VFSFolderView.HYPERION_SETTINGS_ADDRESS, VFSFolderView.GENERIC_LOADING_INTERRUPT_CHANNEL],
                fallback: undefined,
                process: (resolve, reject) => {
                    try {
                        HyperionAPI.hyperion(api => {
                            api.get(VFSFolderView.HYPERION_SETTINGS_ADDRESS).then(entry => {
                                if (entry === undefined) {
                                    // No settings found :: Set default settings
                                    const settings: VFSSettings = {
                                        bypassMobileLaw: false
                                    };
                                    const encodedSettings = JSON.stringify(settings);
                                    api.upstreamTransaction({
                                        type: UpstreamTransactionType.OVERWRITE,
                                        transactionID: v4(),
                                        entry: {
                                            id: VFSFolderView.HYPERION_SETTINGS_ADDRESS,
                                            value: encodedSettings
                                        }
                                    });
                                    resolve(settings);
                                } else {
                                    // No settings found :: Parse them
                                    const rawSettings = entry.value;
                                    const settings = JSON.parse(rawSettings) as VFSSettings;
                                    resolve(settings);
                                }
                            }).catch(e => {
                                console.error(e);
                                reject({
                                    // Err code 1 :: internal Hyperion api error
                                    code: 1,
                                    object: e
                                })
                            });
                        });
                    } catch (e) {
                        console.error(e);
                        reject({
                            // Err code 2 :: uncaught Hyperion api error
                            code: 2,
                            object: e
                        });
                    }
                }
            }),
            viewMultiplexers: []
        });
        // Begin all pre-rendering querying processes
        this.ls().vfsSettings.query();
    }

    init() {
        super.init();
        this.folderViewAssembly();
        this.documentViewAssembly();
        this.folderLevelViewAssembly();
        this.menuAssembly();
        this.menuFilterAssembly();
        this.mobileMainAssembly();
        this.desktopMainAssembly();
        this.mobileMenuAssembly();
        this.loadingInterruptAssembly();
        this.sideMenuAssembly();
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.currentFolderData.query();
        this.createMultiplexer({
            groupID: v4(),
            groupTitle: "Main",
            documents: new Array<AtlasDocument>(),
            activeDocumentID: undefined,
            view: this
        });
        this.props.onMount?.(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.onClose?.();
    }

    getCurrentFolder(): Folder {
        return this.local.state.currentFolderData.get()[0] as Folder;
    }

    reloadFolderView() {
        this.local.state.currentFolderData.query();
        this.rerender("current-folder");
    }

    openCreateFolderSetup() {
        this.dialog(
            <StaticDrawerMenu body={props => (
                <FolderSetupDialog actions={{
                    onSubmit: (folder: Folder) => {
                        const [parentFolder] = this.local.state.currentFolderData.get();
                        if (parentFolder === undefined) {
                            return false;
                        }
                        folder.parentFolder = parentFolder.id;
                        try {
                            AtlasMain.atlas().api().createSubFolder(parentFolder.id, folder);
                            setTimeout(() => {
                                AtlasMain.atlas(atlas => {
                                    atlas.rerender("folders");
                                });
                            }, 1);
                            this.closeLocalDialog();
                            this.reloadFolderView();

                            return true;
                        } catch (e) {
                            return false;
                        }
                    }
                }}/>
            )}/>
        );
    }

    private onClose() {
        this.props.onClose();
    }

    private isDocumentActive(documentID: string): boolean {
        return this.local.state.viewMultiplexers.filter(mux => mux.activeDocumentID === documentID).length > 0;
    }

    private getDocumentMultiplexer(documentID: string): DocumentViewMultiplexerControlConfig | undefined {
        return this.local.state.viewMultiplexers.filter(mux => mux.activeDocumentID === documentID)[0] ?? undefined;
    }

    private selectMultiplexer(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.dialog(
                <StaticDrawerMenu body={props => (
                    <SettingsGroup elements={
                        this.local.state.viewMultiplexers.map(mux => (
                            <SettingsElement groupDisplayMode forceRenderSubpageIcon title={mux.groupTitle} onClick={element => {
                                this.closeLocalDialog();
                                resolve(mux.groupID);
                            }}/>
                        ))
                    }/>
                )}/>
            );
        })
    }

    private openDocumentInMobileMode(data: AtlasDocument) {
        // Create a persistent updater
        this.ls().documentBodyUpdaters.set(data.id, _.debounce((body: string) => {
            AtlasMain.atlas(atlas => {
                const api = atlas.api();
                api.updateDocument(data.id, document => {
                    document.body = body;
                    return document;
                });
                this.getDocumentState(data.id).saveState = DocumentSaveState.SAVED;
                this.rerender(this.toDocumentSpecificChannel(data.id, "persistence-sync-state"));
            });
        }, 2e3));

        // Set initial document save state to synchronized (saved)
        this.local.state.documentStates.set(data.id, {
            saveState: DocumentSaveState.SAVED
        });

        // TODO: Don't render a DocumentViewController directly, render the main multiplexer instead
        //  - For the main mux to work the opening logic has to be nealy reverted back to classic openDocument logic -> mux logic
        // Open a new DocumentViewController instance with the chosen document selected
        this.dialog((
            <Screen deactivatePadding children={
                <DocumentViewController
                    view={this}
                    document={data}
                    updateBody={body => this.updateBody(data.id, body)}
                />
            }/>
        ), () => {
            // Remove the persistent updater
            this.ls().documentBodyUpdaters.delete(data.id)
        });
    }

    public clearSearchFilter() {
        this.updateSearchFilter(property => {
            property.titleFilter = undefined;
            return property;
        });
    }

    public updateSearchFilter(updater: UnaryFunction<VFSFolderViewFilterState>) {
        let filterState = this.ls().filterState;
        filterState = updater(filterState);
        this.local.setStateWithChannels({
            filterState: filterState
        }, ["search-filter-state"]);
    }

    public isSearchFilterAffective(): boolean {
        return this.ls().filterState.titleFilter !== undefined;
    }

    public requestViewClosing() {
        // TODO add shutdown logic / animation
        this.props.onClose();
    }

    public toggleMenu() {
        this.local.setStateWithChannels({
            menuVisible: !this.ls().menuVisible
        }, ["menu"]);
    }

    public createMultiplexer(config: DocumentViewMultiplexerControlConfig) {
        const muxers = this.local.state.viewMultiplexers;
        muxers.push(config);
        this.local.setStateWithChannels({
            viewMultiplexers: muxers
        }, ["multiplexer-created"]);
    }

    public closeMultiplexer(groupID: string) {
        let muxers = this.local.state.viewMultiplexers;
        muxers = muxers.filter(config => config.groupID !== groupID);

        this.local.setStateWithChannels({
            viewMultiplexers: muxers
        }, ["multiplexer-removed"]);
    }

    public openCreateBlankDocumentSetup() {
        this.dialog(
            <DocumentCreateWizard
                view={this}
                currentFolder={this.getCurrentFolder()}
            />
        );
    }

    public updateMultiplexer(multiplexerID: string, updateChannels: Array<string>, updater: (multiplexer: DocumentViewMultiplexerControlConfig) => DocumentViewMultiplexerControlConfig) {
        const multiplexerControlConfigs: DocumentViewMultiplexerControlConfig[] = this.local.state.viewMultiplexers.filter(mux => mux.groupID === multiplexerID);
        if (multiplexerControlConfigs.length === 0) {
            console.error("no multiplexer found")
            return;
        }

        let multiplexer = multiplexerControlConfigs[0];
        multiplexer = updater(multiplexer);
        const updatedMultiplexers = this.local.state.viewMultiplexers.filter(mux => mux.groupID !== multiplexerID);
        updatedMultiplexers.push(multiplexer);

        this.local.setState({
            viewMultiplexers: updatedMultiplexers
        }, new Map<string, any>(), () => {
            this.rerenderMultiplexer(multiplexerID, ...updateChannels);
        });
    }

    public rerenderMultiplexer(multiplexerID: string, ...channels: Array<string>) {
        this.rerender(...this.generateMultiplexerChannel(multiplexerID, ...channels));
    }

    public generateMultiplexerChannel(multiplexerID: string, ...channels: Array<string>): Array<string> {
        return channels.map(channel => `${multiplexerID}-${channel}`);
    }

    public isDocumentOpened(documentID: string): boolean {
        return this.local.state.viewMultiplexers.filter(mux => mux.documents.filter(doc => doc.id === documentID).length > 0).length > 0;
    }

    public toDocumentSpecificChannel(documentID: string, channel: string): string {
        return `${documentID}-${channel}`
    }

    public openDocument(data: AtlasDocument, muxID: string | undefined = undefined) {
        // Choose alternate logic if app opened on mobile device
        if (isMobile) {
            this.openDocumentInMobileMode(data);
            return;
        }

        // Document can only be opened once (overarching all multiplexers)
        // TODO: Allow a document to be opened once in every multiplexer -> Sync edits
        if (this.isDocumentOpened(data.id)) {
            return;
        }

        const updater = (muxID: string) => {
            this.local.state.documentBodyUpdaters.set(data.id, _.debounce((body: string) => {
                AtlasMain.atlas(atlas => {
                    const api = atlas.api();
                    api.updateDocument(data.id, document => {
                        document.body = body;
                        return document;
                    });
                });
                this.getDocumentState(data.id).saveState = DocumentSaveState.SAVED;
                this.rerender(this.toDocumentSpecificChannel(data.id, "persistence-sync-state"));
            }, 1000));

            this.local.state.documentStates.set(data.id, {
                saveState: DocumentSaveState.SAVED
            });

            this.rerender(this.toDocumentSpecificChannel(data.id, "opened"));

            this.updateMultiplexer(muxID, ["main"], multiplexer => {
                const documents = multiplexer.documents;
                documents.push(data);
                multiplexer.documents = documents;
                multiplexer.activeDocumentID = data.id;
                return multiplexer;
            });
        }

        if (this.local.state.viewMultiplexers.length > 1) {
            if (muxID !== undefined) {
                updater(muxID);
            } else {
                this.selectMultiplexer().then(selectedMuxID => {
                    updater(selectedMuxID);
                });
            }
        } else {
            updater(this.local.state.viewMultiplexers[0].groupID)
        }
    }

    public closeAndRemoveDocumentFromMultiplexer(multiplexerID: string, documentID: string) {
        const mux: DocumentViewMultiplexerControlConfig = this.local.state.viewMultiplexers.filter(mux => mux.groupID === multiplexerID)[0] ?? undefined;

        if (mux === undefined) {
            return;
        }

        if (mux.activeDocumentID === documentID) {
            mux.activeDocumentID = undefined;
        }

        this.rerender(this.toDocumentSpecificChannel(documentID, "closed"));

        this.updateMultiplexer(multiplexerID, ["main"], multiplexer => {
            multiplexer.documents = multiplexer.documents.filter(doc => doc.id !== documentID);

            if (multiplexer.documents.length > 0) {
                multiplexer.activeDocumentID = multiplexer.documents[0]?.id ?? undefined;
            }


            return multiplexer;
        });
    }

    public getDocumentsInCurrentFolder(applyFilters: boolean = true): Array<AtlasDocument> {
        const documentIDs: Array<string> = this.getCurrentFolder().documentsIDs ?? new Array<string>();
        let documents: Array<AtlasDocument> = new Array<AtlasDocument>();
        AtlasMain.atlas(atlas => {
            const api: IAtlasAPI = atlas.api();
            //  TODO: Only call getDocument once -> Due to a performance leak
            //   - WELL NOT REALLY ~1ms..
            documentIDs.forEach(docID => {
                try {
                    const doc: AtlasDocument = api.getDocument(docID);
                    if (doc !== undefined) {
                        documents.push(doc);
                    } else {
                        // TODO: Display a warning
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        });
        if (applyFilters) documents = this.applyDocumentFilters(documents);
        return documents;
    }

    public applyDocumentFilters(documents: Array<AtlasDocument>): Array<AtlasDocument> {
        const filter = this.ls().filterState;
        // Apply search title filter
        try {
            if (filter.titleFilter !== undefined) {
                documents = documents.filter(doc => doc.title?.match(filter.titleFilter!));
            }
        } catch (e) {
            console.error(e);
        }
        return documents;
    }

    public updateBody(documentID: string, newBody: string) {
        setTimeout(() => {
            if (this.getDocumentState(documentID).saveState !== DocumentSaveState.PENDING) {
                this.getDocumentState(documentID).saveState = DocumentSaveState.PENDING;
                this.rerender(this.toDocumentSpecificChannel(documentID, "persistence-sync-state"));
            }

            const updater = this.local.state.documentBodyUpdaters.get(documentID);

            if (updater !== undefined) {
                updater(newBody);
            } else {
                console.error(`Opened document '${documentID}' has no corresponding body update adapter`);
            }
        }, 1);
    }

    public getDocumentState(documentID: string): DocumentState {
        const state = this.local.state.documentStates.get(documentID);
        if (state === undefined) {
            throw new Error(`getDocumentState cannot find state for document id '${documentID}'`)
        }
        return state;
    }

    // ASSEMBLIES

    private folderLevelViewAssembly() {
        this.assembly.assembly("folder-level-view", theme => {
            return this.component(local => (
                <QueryDisplay<Folder | undefined> q={this.local.state.currentFolderData} renderer={{
                    success: (q, f: Folder | undefined) => {
                        const currentFolder = this.local.state.currentFolderData.get()[0];
                        const tree: Array<Folder> = new Array<Folder>();
                        let folder = currentFolder;
                        tree.push(folder as Folder);
                        while (folder?.parentFolder !== undefined) {
                            folder = AtlasMain.atlas().api().getFolder(folder.parentFolder);
                            tree.push(folder);
                        }
                        return (
                            <FolderPathView
                                path={tree.reverse()}
                                gotoFolder={selectedFolder => {
                                    this.changeCurrentFolder(selectedFolder.id, "up");
                                }}
                            />
                        );
                    }
                }}/>
            ), ...Q.allChannels("current-folder"));
        })
    }

    private folderViewAssembly() {
        this.assembly.assembly("folder-view", theme => {
            const currentFolder = this.local.state.currentFolderData.get()[0] as Folder;
            const subFolders = AtlasMain.atlas().api().getAllFolders({
                test(subFolder: Folder): boolean {
                    return !!currentFolder.subFolderIDs?.includes(subFolder.id);
                }
            });

            // TODO: Remove empty jsx -> is part of FolderList already
            return (
                <Flex fw elements={[
                    <Flex fw elements={[
                        subFolders.length > 0 ? (
                            <FolderList
                                folders={subFolders}
                            />
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
                                    onClick={() => this.openCreateFolderSetup()}
                                />
                            ]}/>
                        )
                    ]}/>,
                ]}/>
            );
        });
    }

    private documentViewAssembly() {
        this.assembly.assembly("document-view", theme => {
            return (
                <DocumentList
                    documents={this.getDocumentsInCurrentFolder()}
                />
            );
        });
    }

    private menuFilterAssembly() {
        this.assembly.assembly("menu-filter", theme => {
            const updateChannel = "search-filter-state";
            const updateInputChannel = "search-filter-input";
            return (
                <Flex fw elements={[
                    // Filter header & toolbar
                    <FlexRow fw align={Align.CENTER} style={{ minHeight: "20px" }} justifyContent={Justify.SPACE_BETWEEN} elements={[
                        <Text text={"Filters"} bold/>,
                        <FlexRow align={Align.CENTER} gap={theme.gaps.smallGab} elements={[
                            this.component(() => (
                                <If condition={this.isSearchFilterAffective()} ifTrue={
                                    // Filter is effective
                                    <Icon
                                        colored
                                        uiNoHighlightOnDefault
                                        coloredOnDefault={false}
                                        visualMeaning={VM.ERROR}
                                        icon={<DeleteRounded/>}
                                        tooltip={"Clear filters"}
                                        onClick={() => {
                                            this.clearSearchFilter();
                                            // TODO: Make better
                                            setTimeout(() => this.rerender(updateInputChannel), 500);
                                        }}
                                    />
                                }/>
                            ), updateChannel)
                        ]}/>
                    ]}/>,
                    // Filter component
                    this.component(() => {
                        // TODO: Fix: Clearing doesn't delete input value
                        console.log("render filter input", this.ls().filterState.titleFilter)

                        return (
                            <Input placeholder={"Search folders & documents"} inputMode={"search"} defaultValue={this.ls().filterState.titleFilter} onChange={ev => {
                                const newTitleFilter: string = ev.target.value;
                                this.ls().debouncedTitleFilterUpdater(newTitleFilter);
                            }}/>
                        );
                    }, updateInputChannel)
                ]}/>
            );
        });
    }

    private sideMenuAssembly() {
        this.assembly.assembly("side-menu", theme => {
            return (
                <AF elements={[
                    <SideMenu view={this}/>,
                    this.component(() => this.ls().menuVisible ? <Separator orientation={Orientation.VERTICAL}/> : <></>, "menu"),
                ]}/>
            );
        })
    }

    private menuAssembly() {
        this.assembly.assembly("menu", t => {
            if (this.ls().menuVisible) {
                return (
                    <Flex fh width={px(350)} style={{
                        minWidth: "350px",
                        backgroundColor: t.colors.backgroundHighlightColor.css()
                    }} elements={[
                        <OverflowWithHeader height={percent(100)} dir={FlexDirection.COLUMN_REVERSE}  staticContainer={{
                            gap: px(),
                            elements: [
                                <Flex fw padding align={Align.CENTER} flexDir={FlexDirection.ROW} justifyContent={Justify.CENTER} elements={[
                                    <Icon icon={<AttachmentIcon/>}/>,
                                    <Flex fw fh justifyContent={Justify.CENTER} gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                                        // Badge.beta(),
                                        <Text text={"Atlas Document Viewer"} bold/>,
                                    ]}/>,
                                    <Icon icon={<SettingsIcon/>}/>
                                ]}/>
                            ]
                        }} overflowContainer={{
                            elements: [
                                <Flex height={px(50)} fw fh padding style={{ backgroundColor: t.colors.backgroundHighlightColor.css() }} elements={[




                                    <HOCWrapper body={() => {
                                        // type Summary = {
                                        //     occurrences: number,
                                        //     title: string
                                        // };
                                        // const docSummaries: Map<string, Summary> = new Map<string, Summary>();
                                        // Object.keys(DocumentType).filter((item) => isNaN(Number(item))).forEach(type => docSummaries.set(type, {
                                        //     occurrences: 0,
                                        //     title: type.toLowerCase().toLocaleUpperCase()
                                        // }));
                                        // AtlasMain.atlas().api().getAllDocuments().forEach(doc => {
                                        //     const summary = docSummaries.get(String(doc.documentType ?? DocumentType.UNSPECIFIED))!;
                                        //     if (summary !== undefined) summary.occurrences++;
                                        // });

                                        const sum = AtlasMain.atlas().api().getStorageSummary(true);
                                        return (
                                            <StorageInformationPanel series={sum.archetypeSummaries.map(arch => ({
                                                title: arch.archetype.name,
                                                occurrences: arch.fileCount
                                            }))}/>
                                        );
                                    }}/>,


                                    this.component(() => this.a("folder-level-view"), "current-folder"),

                                    this.component(() => (
                                        <QueryDisplay<Folder | undefined> q={this.local.state.currentFolderData} renderer={{
                                            processing(q: Queryable<Folder | undefined>): JSX.Element {
                                                return (
                                                    <>processing..</>
                                                );
                                            },
                                            success: (q: Queryable<Folder | undefined>, data: Folder | undefined) => {

                                                const FolderSlider = React.forwardRef((props, ref) => {
                                                    return (
                                                        <div ref={ref as any} {...props} style={{ width: "100%" }} children={
                                                            <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                                                                this.component(() => this.a("folder-view"), "folder-view"),
                                                                this.component(() => this.a("document-view"), "document-view", "search-filter-state"),
                                                            ]}/>
                                                        }/>
                                                    );
                                                });

                                                const animate = this.ls().animateFolderSlider;

                                                if (this.ls().animateFolderSlider) {
                                                    this.local.setState({
                                                        animateFolderSlider: false
                                                    });
                                                }

                                                return (
                                                    <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                                                        <DrawerHeader
                                                            header={String(this.getCurrentFolder()?.title)}
                                                            badgeText={"Folder view"}
                                                            enableBadge={false}
                                                            badgeVM={ObjectVisualMeaning.UI_NO_HIGHLIGHT}
                                                            description={this.getCurrentFolder().description}
                                                        />,


                                                        <Flex fw margin={createMargin(0, 0, 40, 0)} align={Align.CENTER} elements={[
                                                            <Flex wrap={FlexWrap.WRAP} flexDir={FlexDirection.ROW} fw gap={t.gaps.smallGab} align={Align.CENTER} justifyContent={Justify.CENTER} elements={
                                                                this.getCurrentFolder().tags?.map(s => (
                                                                    <Box highlightShadow={false} cursor={Cursor.pointer} highlight opaque paddingY={px(4)} paddingX={px(7)} visualMeaning={VM.SUCCESS} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(500)}} borderless children={
                                                                        <Text text={s} whitespace={"nowrap"} cursor={Cursor.pointer} visualMeaning={VM.SUCCESS} fontSize={px(12)} coloredText type={TextType.secondaryDescription}/>
                                                                    }/>
                                                                ))
                                                            }/>,

                                                            <Flex wrap={FlexWrap.WRAP} flexDir={FlexDirection.ROW} fw gap={t.gaps.smallGab} align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                                                <Button tooltip={"Import files"} bgColorOnDefault={false} border={false} opaque visualMeaning={VM.UI_NO_HIGHLIGHT} children={
                                                                    <Icon icon={<UploadRounded/>} onClick={() => {
                                                                        this.dialog(
                                                                            <EntityImportDialog onCancel={() => this.closeLocalDialog()} onSubmit={files => {
                                                                                AtlasMain.atlas(atlas => {
                                                                                    atlas.api().importFiles(this.ls().currentFolderID!, files)
                                                                                    this.closeLocalDialog();
                                                                                    this.ls().currentFolderData.query();
                                                                                });
                                                                            }}/>
                                                                        );
                                                                    }}/>
                                                                }/>
                                                            ]}/>
                                                        ]}/>,


                                                        this.a("menu-filter"),

                                                        // this.component(() => this.a("folder-view"), "folder-view"),
                                                        // this.component(() => this.a("document-view"), "document-view", "search-filter-state"),

                                                        <If condition={animate} ifTrue={
                                                            <Slide in id={v4()} key={v4()} direction={this.ls().folderSliderAnimationDirection} children={
                                                                <FolderSlider/>
                                                            }/>
                                                        } ifFalse={
                                                            <FolderSlider/>
                                                        }/>
                                                    ]}/>
                                                );
                                            },
                                            error: (q, error) => {
                                                return (
                                                    <>error {String(error?.object)}</>
                                                );
                                            }
                                        }}/>
                                    ), ...Q.allChannels("current-folder"))
                                ]}/>
                            ]
                        }}/>
                    ]}/>
                );
            } else {
                return (
                    <></>
                );
            }
        })
    }

    public changeCurrentFolder(newFolderID: string, heading: "up" | "down" | undefined = undefined) {
        if (heading !== undefined) {
            this.primeSliderAnimation(heading === "down" ? "left" : "right");
        }

        this.local.setState({
            currentFolderID: newFolderID
        }, new Map<string, any>(), () => {
            this.reloadFolderView();
        });
    }

    public primeSliderAnimation(direction: "right" | "left" | "up" | "down" | undefined) {
        this.local.setState({
            folderSliderAnimationDirection: direction,
            animateFolderSlider: true
        });
    }

    private mobileMenuAssembly() {
        this.assembly.assembly("mobile-menu", t => {
            return (
                <Flex fh fw align={Align.CENTER} elements={[
                    <OverflowWithHeader gap={px()} height={percent(100)} dir={FlexDirection.COLUMN_REVERSE} staticContainer={{
                        elements: [
                            this.component(() => (
                                <QueryDisplay<Folder | undefined> q={this.local.state.currentFolderData} renderer={{
                                    processing(q: Queryable<Folder | undefined>): JSX.Element {
                                        return (
                                            <>processing..</>
                                        );
                                    },
                                    success: (q: Queryable<Folder | undefined>, data: Folder | undefined) => {
                                        return (
                                            <Flex style={{
                                                paddingTop: t.gaps.defaultGab.css(),
                                                paddingLeft: t.gaps.defaultGab.css(),
                                                paddingRight: t.gaps.defaultGab.css(),
                                            }} fw elements={[
                                                <Flex fw gap={px(6)} elements={[
                                                    <FlexRow gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                                                        <Text bold fontSize={px(21)} text={String(this.getCurrentFolder()?.title)}/>,
                                                        <Icon icon={<EditIcon/>}/>
                                                    ]}/>,

                                                    <FlexRow fw align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                                                        <FlexRow fw gap={px(5)} align={Align.CENTER} elements={[
                                                            <Description renderMarkdown={false} text={`${data?.subFolderIDs?.length ?? 0} folders`}/>,
                                                            <Dot/>,
                                                            <Description renderMarkdown={false} text={`Created ${new Date(Date.parse(data?.creationDate ?? new Date().toISOString())).toDateString()}`}/>
                                                        ]}/>,

                                                        <AvatarGroup sx={{
                                                            ".MuiAvatar-root": {
                                                                borderColor: `${t.colors.backgroundColor.css()} !important`
                                                            }
                                                        }} children={
                                                            [
                                                                "https://i.pinimg.com/originals/cc/73/9b/cc739b3e53b9562f98400b7817614d68.png",
                                                                "https://i.pinimg.com/564x/b2/24/20/b2242039d0b728a5e36ba0fef544b6e8.jpg",
                                                                "https://static.wikia.nocookie.net/95c5a16e-c866-4373-b4fd-6589e559b778/scale-to-width/755"
                                                            ].map(url => (
                                                                <Avatar src={url} sx={{
                                                                    width: 16, height: 16
                                                                }}/>
                                                            ))
                                                        }/>
                                                    ]}/>
                                                ]}/>,
                                                <Separator orientation={Orientation.HORIZONTAL}/>
                                            ]}/>
                                        );
                                    },
                                    error: (q, error) => {
                                        return (
                                            <>error</>
                                        );
                                    }
                                }}/>
                            ), ...Q.allChannels("current-folder"))
                        ]
                    }} overflowContainer={{
                        elements: [
                            <Flex height={px(50)} fw fh padding elements={[
                                <FlexRow fw justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} elements={[
                                    this.component(() => this.a("folder-level-view"), "current-folder"),
                                    <FlexRow align={Align.CENTER} elements={[
                                        <Icon icon={<UploadRounded/>} onClick={() => {
                                            this.dialog(
                                                <EntityImportDialog onCancel={() => this.closeLocalDialog()} onSubmit={files => {
                                                    AtlasMain.atlas(atlas => {
                                                        atlas.api().importFiles(this.ls().currentFolderID!, files)
                                                        this.closeLocalDialog();
                                                        this.ls().currentFolderData.query();
                                                    });
                                                }}/>
                                            );
                                        }}/>
                                    ]}/>
                                ]}/>,

                                this.component(() => (
                                    <QueryDisplay<Folder | undefined> q={this.local.state.currentFolderData} renderer={{
                                        processing(q: Queryable<Folder | undefined>): JSX.Element {
                                            return (
                                                <>processing..</>
                                            );
                                        },
                                        success: (q: Queryable<Folder | undefined>, data: Folder | undefined) => {

                                            const FolderSlider = React.forwardRef((props, ref) => {
                                                return (
                                                    <div ref={ref as any} {...props} style={{ width: "100%" }} children={
                                                        <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                                                            // <Flex margin={createMargin(0, 0, 40, 0)} wrap={FlexWrap.WRAP} flexDir={FlexDirection.ROW} fw gap={t.gaps.smallGab} align={Align.CENTER} justifyContent={Justify.CENTER} elements={
                                                            //     this.getCurrentFolder().tags?.map(s => (
                                                            //         <Box highlightShadow={false} cursor={Cursor.pointer} highlight opaque paddingY={px(4)} paddingX={px(7)} visualMeaning={VM.SUCCESS} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(500)}} borderless children={
                                                            //             <Text text={s} whitespace={"nowrap"} cursor={Cursor.pointer} visualMeaning={VM.SUCCESS} fontSize={px(12)} coloredText type={TextType.secondaryDescription}/>
                                                            //         }/>
                                                            //     ))
                                                            // }/>,
                                                            // this.a("menu-filter"),
                                                            this.component(() => this.a("folder-view"), "folder-view"),
                                                            this.component(() => this.a("document-view"), "document-view", "search-filter-state"),
                                                        ]}/>
                                                    }/>
                                                );
                                            });

                                            if (this.ls().animateFolderSlider) {
                                                this.local.setState({
                                                    animateFolderSlider: false
                                                });
                                                return (
                                                    <Slide in id={v4()} key={v4()} direction={this.ls().folderSliderAnimationDirection} children={
                                                        <FolderSlider/>
                                                    }/>
                                                );
                                            } else {
                                                return (
                                                    <FolderSlider/>
                                                );
                                            }
                                        },
                                        error: (q, error) => {
                                            return (
                                                <>error</>
                                            );
                                        }
                                    }}/>
                                ), ...Q.allChannels("current-folder"))
                            ]}/>
                        ]
                    }}/>
                ]}/>
            );
        });
    }

    private mobileMainAssembly() {
        this.assembly.assembly("mobile-main", theme => {
            return (
                <Screen deactivatePadding={false} children={
                    this.component(() => this.a("mobile-menu"), "menu")
                }/>
            );
        });
    }

    private desktopMainAssembly() {
        this.assembly.assembly("desktop-main", theme => {
            return (
                <Screen deactivatePadding children={
                    <OverflowWithHeader dir={FlexDirection.COLUMN_REVERSE} staticContainer={{ gap: px(), elements: [] }} overflowContainer={{
                        elements: [
                            <Flex fh fw gap={px()} flexDir={FlexDirection.ROW} elements={[
                                // <SideMenu view={this}/>,

                                this.a("side-menu"),

                                this.component(() => this.a("menu"), "menu"),

                                // Main view - Flexing middle section
                                this.component(local => {
                                    return (
                                        <LiteGrid style={{ width: "100%" }} columns={local.state.viewMultiplexers.length} children={
                                            <AF elements={
                                                local.state.viewMultiplexers.map(config => (
                                                    <DocumentViewMultiplexer
                                                        controlConfigMirror={config}
                                                        changeActiveDocument={newActiveDocumentID => {
                                                            this.updateMultiplexer(config.groupID, ["main"], multiplexer => {
                                                                multiplexer.activeDocumentID = newActiveDocumentID;
                                                                return multiplexer;
                                                            });
                                                        }}
                                                        bodyUpdater={(documentID, body) => {
                                                            this.updateBody(documentID, body)
                                                        }}
                                                    />
                                                ))
                                            }/>
                                        }/>
                                    );
                                }, "multiplexer-created", "multiplexer-removed", "multiplexer-root"),

                                this.component(() => this.a("menu"), "menu"),

                                this.a("side-menu"),
                            ]}/>
                        ]
                    }}/>
                }/>
            );
        });
    }

    private loadingInterruptAssembly() {
        this.assembly.assembly("loading-interrupt", theme => {
            if (isMobile) {
                return (
                    <Screen deactivatePadding children={
                        <Centered fullHeight children={
                            <Flex align={Align.CENTER} elements={[
                                <AtlasLogo width={vw(50)}/>,
                                <Description text={"Loading"} fontSize={px(20)} renderMarkdown={true}/>
                            ]}/>
                        }/>
                    }/>
                );
            }

            return (
                <Screen deactivatePadding children={
                    <Centered fullHeight children={
                        <Flex align={Align.CENTER} elements={[
                            <AtlasLogo width={vw(10)}/>,
                            <Description text={"Loading"} fontSize={px(20)} renderMarkdown={true}/>
                        ]}/>
                    }/>
                }/>
            );
        })
    }

    /**
     * TODO: Add loading interrupt error screen / anomaly display
     */
    componentRender(p: VFSFolderViewProps, s: any, l: VFSFolderViewLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(() => (
            <QueryDisplay<Optional<VFSSettings>>
                q={this.ls().vfsSettings}
                renderer={{
                    success: (q: Queryable<Optional<VFSSettings>>, data: Optional<VFSSettings>): JSX.Element => (
                        <AF elements={[
                            <Mobile children={this.a("mobile-main")}/>,
                            <Default children={this.a("desktop-main")}/>
                        ]}/>
                    ),
                    processing: (q: Queryable<Optional<VFSSettings>>): JSX.Element => this.a("loading-interrupt")
                }}
            />
        ), ...Q.allChannels(VFSFolderView.GENERIC_LOADING_INTERRUPT_CHANNEL));
    }
}
