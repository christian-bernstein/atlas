import {BC} from "../../base/BernieComponent";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Themeable} from "../../base/logic/style/Themeable";
import {Flex} from "../../base/components/base/FlexBox";
import {Align} from "../../base/logic/style/Align";
import {Icon} from "../../base/components/base/Icon";
import {ImportExportRounded} from "@mui/icons-material";
import {percent, px} from "../../base/logic/style/DimensionalMeasured";
import {DrawerHeader} from "../../base/components/base/DrawerHeader";
import {VM} from "../../base/logic/style/ObjectVisualMeaning";
import {LiteGrid} from "../../base/components/base/LiteGrid";
import {AF} from "../../base/components/logic/ArrayFragment";
import {Tooltip} from "../../base/components/base/Tooltip";
import {Text, TextType} from "../../base/components/base/Text";
import {StaticDrawerMenu} from "../../base/components/base/StaticDrawerMenu";
import React from "react";
import {FlexDirection} from "../../base/logic/style/FlexDirection";
import {Justify} from "../../base/logic/style/Justify";
import {Dot} from "../../base/components/base/Dot";
import {ReactComponent as HelpIcon} from "../../../assets/icons/ic-20/ic20-help.svg";
import {createMargin} from "../../base/logic/style/Margin";
import {SettingsGroup} from "../../base/components/base/SettingsGroup";
import {SettingsElement} from "../../base/components/base/SettingsElement";
import {Input} from "../../base/components/base/Input";
import {wizardRoutines} from "../wizard/document/wizards/WizardRoutineCollection";
import {HOCWrapper} from "../../base/components/HOCWrapper";
import {VFSFolderView} from "./VFSFolderView";
import {Folder} from "../data/Folder";
import {AtlasMain} from "../AtlasMain";

export type DocumentCreateWizardProps = {
    currentFolder: Folder,
    view: VFSFolderView
}

export class DocumentCreateWizard extends BC<DocumentCreateWizardProps, any, any> {

    componentRender(p: DocumentCreateWizardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => {
                return (
                    <Flex fw align={Align.CENTER} elements={[
                        <Icon icon={<ImportExportRounded/>} style={{ transform: "rotate(45deg)" }} size={px(40)}/>,

                        <DrawerHeader
                            header={"Document creation wizard"}
                            enableBadge
                            badgeVM={VM.UI_NO_HIGHLIGHT}
                            badgeText={"Atlas-Viewer"}
                            description={"Manage the creation & installation of ISO-images.\nISO-Images are used to **import** & **export** data from Atlas™."}
                            // margin={createMargin(0, 0, 40, 0)}
                        />,

                        <Flex fw justifyContent={Justify.CENTER} align={Align.CENTER} margin={createMargin(40, 0, 40, 0)} elements={[
                            <Flex width={percent(100 / 5 * 4)} elements={[
                                <Input
                                    placeholder={"Search for routines & templates"}
                                />,
                            ]}/>
                        ]}/>,

                        <Flex fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Text text={"Recommended"} bold/>,
                                <Dot/>,
                                <Text text={`${wizardRoutines.length}`} type={TextType.secondaryDescription}/>,
                            ]}/>,

                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Tooltip title={"Help"} arrow children={
                                    <Icon icon={<HelpIcon/>} size={px(16)}/>
                                }/>
                            ]}/>,
                        ]}/>,

                        <HOCWrapper body={wrapper => (
                            <LiteGrid columns={2} gap={t.gaps.smallGab} children={
                                <AF elements={[
                                    ...wizardRoutines.map(routine => routine.previewCard(() => {

                                        // TODO: Implement multi-engine support

                                        routine.run(p.view, p.currentFolder, wrapper, document => {
                                            setTimeout(() => {
                                                AtlasMain.atlas(atlas => {
                                                    atlas.rerender("folders");
                                                });
                                            }, 1);
                                            wrapper.closeLocalDialog();
                                            p.view.closeLocalDialog();
                                            p.view.reloadFolderView();

                                            // TODO: Make optional -> onSetupComplete parameter: (openAfterCreation: boolean)
                                            p.view.openDocument(document);
                                        }).then(r => { /* TODO: Implement something here \c.c/ */ })
                                    }))
                                ]}/>
                            }/>
                        )}/>,






                        <Flex margin={createMargin(20, 0, 0, 0)} fw flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} elements={[
                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Text text={"Templates"} bold/>,
                                <Dot/>,
                                <Text text={`${2}`} type={TextType.secondaryDescription}/>,
                            ]}/>,

                            <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Tooltip title={"Help"} arrow children={
                                    <Icon icon={<HelpIcon/>} size={px(16)}/>
                                }/>
                            ]}/>,
                        ]}/>,

                        <SettingsGroup elements={[
                            <SettingsElement groupDisplayMode title={"Event note"}/>,
                            <SettingsElement groupDisplayMode title={"Memory log"}/>,
                        ]}/>,
                    ]}/>
                );
            }}/>
        );
    }
}
