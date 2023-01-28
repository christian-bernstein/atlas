import {BC} from "../../base/BernieComponent";
import {AtlasDocument} from "../data/AtlasDocument";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Themeable} from "../../base/logic/style/Themeable";
import {inDevDocumentView} from "./views/InDevDocumentView";
import {Centered} from "../../base/components/base/PosInCenter";
import {Text, TextType} from "../../base/components/base/Text";
import {Flex} from "../../base/components/base/FlexBox";
import {px} from "../../base/logic/style/DimensionalMeasured";
import {Align} from "../../base/logic/style/Align";
import {Justify} from "../../base/logic/style/Justify";
import {VFSFolderView} from "../components/VFSFolderView";
import {DocumentViewRenderContext} from "./DocumentViewRenderContext";
import {AtlasMain} from "../AtlasMain";
import {DocumentBodyUpdaterInstruction} from "./DocumentBodyUpdaterInstruction";
import {DocumentType} from "../data/DocumentType";
import {markdownDocumentView} from "./views/MarkdownDocumentView";
import {websiteDocumentView} from "./views/WebsiteDocumentView";
import {pdfDocumentView} from "./views/PDFDocumentView";
import {AF} from "../../base/components/logic/ArrayFragment";
import {Q, Queryable} from "../../base/logic/query/Queryable";
import {Optional} from "../../base/Optional";
import {HyperionStorableEntry} from "../hyperion/HyperionStorableEntry";
import {HyperionAPI} from "../hyperion/HyperionAPI";
import {Description} from "../../base/components/base/Description";
import {QueryError} from "../../base/logic/query/QueryError";
import {QueryDisplay} from "../../base/components/logic/QueryDisplay";
import {HyperionIndexedDBStreamAdapter} from "../hyperion/HyperionIndexedDBStreamAdapter";
import {HyperionImageSubscriber} from "../hyperion/subscribers/HyperionImageSubscriber";
import {GenericFileArchetype} from "../data/documentArchetypes/GenericFileArchetype";
import {DocumentView} from "./DocumentView";
import {imageDocumentView} from "./views/ImageDocumentView";

export type DocumentViewControllerProps = {
    view: VFSFolderView,
    document?: AtlasDocument,
    updateBody: (body: string) => void
}

export class DocumentViewController extends BC<DocumentViewControllerProps, any, any> {

    componentRender(p: DocumentViewControllerProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.document === undefined) {

            return (
                <Flex fw fh onDoubleClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    this.props.view.toggleMenu();
                }} elements={[
                    <Centered style={{ position: "relative" }} fullHeight children={
                        <AF elements={[
                            <Flex fw fh style={{ position: "absolute" }} elements={[
                                <HyperionImageSubscriber
                                    hyperionEntryID={"atlas-document-background"}
                                    openFullscreenContextOnClick={false}
                                    preventUserSelection
                                />
                            ]}/>,

                            // TODO: Make visible again
                            <Flex align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                <Text text={"No document selected"} type={TextType.secondaryDescription}/>,
                                <Text text={"Select a document from the folder view"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                            ]}/>
                        ]}/>
                    }/>
                ]}/>
            );
        } else {
            const computedDocID = p.document?.id ?? "special@fallback";

            // TODO: MAKE BETTER!!!

            if (p.document.documentType === DocumentType.PDF) {
                return pdfDocumentView.renderer(new DocumentViewRenderContext({
                    view: p.view,
                    documentID: p.document.id,
                    documentGetter: () => AtlasMain.atlas().api().getDocument(computedDocID),
                    documentStateGetter: () => p.view.getDocumentState(computedDocID),
                    bodyUpdater: {
                        update: (instruction: DocumentBodyUpdaterInstruction) => {
                            // TODO implement better solution (bypass debouncing)
                            p.updateBody(instruction.newBody);
                        }
                    }
                }))
            }

            if (p.document.documentType === DocumentType.WEBSITE) {
                return websiteDocumentView.renderer(new DocumentViewRenderContext({
                    view: p.view,
                    documentID: p.document.id,
                    documentGetter: () => AtlasMain.atlas().api().getDocument(computedDocID),
                    documentStateGetter: () => p.view.getDocumentState(computedDocID),
                    bodyUpdater: {
                        update: (instruction: DocumentBodyUpdaterInstruction) => {
                            // TODO implement better solution (bypass debouncing)
                            p.updateBody(instruction.newBody);
                        }
                    }
                }))
            }

            if (p.document.documentType === DocumentType.MARKDOWN) {
                return markdownDocumentView.renderer(new DocumentViewRenderContext({
                    view: p.view,
                    documentID: p.document.id,
                    documentGetter: () => AtlasMain.atlas().api().getDocument(computedDocID),
                    documentStateGetter: () => p.view.getDocumentState(computedDocID),
                    bodyUpdater: {
                        update: (instruction: DocumentBodyUpdaterInstruction) => {
                            // TODO implement better solution (bypass debouncing)
                            p.updateBody(instruction.newBody);
                        }
                    }
                }))
            }

            if (p.document.documentType === DocumentType.GENERIC_FILE) {
                const rawBody = p.document.body ?? "";
                const body: GenericFileArchetype = JSON.parse(rawBody);

                const renderDocumentView = (view: DocumentView): JSX.Element => {
                    return view.renderer(new DocumentViewRenderContext({
                        view: p.view,
                        documentID: p.document!.id,
                        documentGetter: () => AtlasMain.atlas().api().getDocument(computedDocID),
                        documentStateGetter: () => p.view.getDocumentState(computedDocID),
                        bodyUpdater: {
                            update: (instruction: DocumentBodyUpdaterInstruction) => {
                                // TODO implement better solution (bypass debouncing)
                                p.updateBody(instruction.newBody);
                            }
                        }
                    }))
                }

                switch (body.filetype) {
                    case "image/png": return renderDocumentView(imageDocumentView)
                }
            }

            return inDevDocumentView.renderer(new DocumentViewRenderContext({
                view: p.view,
                documentID: p.document.id,
                documentGetter: () => AtlasMain.atlas().api().getDocument(computedDocID),
                documentStateGetter: () => p.view.getDocumentState(computedDocID),
                bodyUpdater: {
                    update: (instruction: DocumentBodyUpdaterInstruction) => {
                        // TODO implement better solution (bypass debouncing)
                        p.updateBody(instruction.newBody);
                    }
                }
            }));
        }
    }
}
