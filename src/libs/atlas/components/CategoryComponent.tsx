import {BC} from "../../base/BernieComponent";
import {Category} from "../data/Category";
import {Themeable} from "../../base/logic/style/Themeable";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Flex} from "../../base/components/base/FlexBox";
import {getOr} from "../../base/Utils";
import {VM} from "../../base/logic/style/ObjectVisualMeaning";
import {DrawerHeader} from "../../base/components/base/DrawerHeader";
import {AtlasMain} from "../AtlasMain";
import {DocumentComponent} from "./DocumentComponent";
import {UnresolvedDocumentComponent} from "./UnresolvedDocumentComponent";
import {SettingsGroup} from "../../base/components/base/SettingsGroup";
import {DocumentSetupDialog} from "./DocumentSetupDialog";
import {percent, px} from "../../base/logic/style/DimensionalMeasured";
import {Button} from "../../base/components/base/Button";
import React from "react";
import {StaticDrawerMenu} from "../../base/components/base/StaticDrawerMenu";
import {FlexDirection} from "../../base/logic/style/FlexDirection";

export type CategoryComponentProps = {
    data: Category
}

export class CategoryComponent extends BC<CategoryComponentProps, any, any> {

    componentRender(p: CategoryComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => (
                <Flex fw elements={[
                    <DrawerHeader
                        header={getOr(p.data.title, "N/A")}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"Category view"}
                        description={p.data.description}
                    />,

                    <Flex fw padding paddingX={px(25)} flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} elements={[
                        <Button width={percent(100)} text={"Create document"} onClick={() => {
                            this.dialog(
                                <DocumentSetupDialog category={p.data} actions={{
                                    onSubmit: document => {
                                        const success = AtlasMain.atlas().api().createDocument(document);
                                        if (success) {
                                            AtlasMain.atlas().api().linkDocumentToCategory(document.id, p.data.id);
                                        }

                                        setTimeout(() => {
                                            this.closeLocalDialog();
                                            this.rerender("documents");
                                        }, 1);
                                        return success;
                                    }
                                }}/>
                            );
                        }}/>
                    ]}/>,

                    this.component(() => {
                        const categoryID = p.data.id;
                        const freshCategoryDate = AtlasMain.atlas().api().getCategory(categoryID);

                        return (
                            <SettingsGroup children={"Select document"} elements={
                                freshCategoryDate.documents.map(id => {
                                    try {
                                        return (
                                            <DocumentComponent data={AtlasMain.atlas().api().getDocument(id)}/>
                                        );
                                    } catch (e) {
                                        return (
                                            <UnresolvedDocumentComponent id={id} error={e}/>
                                        );
                                    }
                                })
                            }/>
                        );
                    }, "documents"),


                ]}/>
            )}/>
        );
    }

}
