import {DocumentView} from "../DocumentView";
import React from "react";
import {BC} from "../../../base/BernieComponent";
import {Assembly} from "../../../base/logic/assembly/Assembly";
import {Themeable} from "../../../base/logic/style/Themeable";
import {DocumentState} from "../../data/DocumentState";
import {DocumentViewRenderContext} from "../DocumentViewRenderContext";
import {VFSFolderView} from "../../components/VFSFolderView";
import {WebsiteDocumentArchetype} from "../../data/documentArchetypes/WebsiteDocumentArchetype";

export const websiteDocumentView: DocumentView = {
    renderer: (context) => {
        return (
            <WebsiteDocumentView context={context}/>
        );
    }
}

type WebsiteDocumentViewProps = {
    context: DocumentViewRenderContext
}

class WebsiteDocumentView extends BC<WebsiteDocumentViewProps, any, any> {

    componentRender(p: WebsiteDocumentViewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        // const docState: DocumentState = view.getDocumentState(document.id);
        const document = p.context.data.documentGetter();
        const docState: DocumentState = p.context.data.documentStateGetter();
        const view: VFSFolderView = p.context.data.view;

        let url: string = "";
        try {
            url = (JSON.parse(document.body as string) as WebsiteDocumentArchetype).url ?? "Cannot load..";
        } catch (e) {
            console.error(e);
        }

        return (
            <iframe
                src={url}
                width={"100%"}
                height={"100%"}
                style={{ border: "none" }}
            />
        );
    }
}
