import {DocumentView} from "../DocumentView";
import React from "react";
import {GenericFileArchetype} from "../../data/documentArchetypes/GenericFileArchetype";

export const imageDocumentView: DocumentView = {
    renderer: (context) => {
        const document = context.data.documentGetter();
        const rawBody = document.body ?? "";
        const body: GenericFileArchetype = JSON.parse(rawBody);
        return (
            <img src={body.body} alt={"file content"} style={{
                width: "100%",
                height: "100%",
            }}/>
        );
    }
}
