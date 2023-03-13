import {DocumentView} from "../DocumentView";
import React from "react";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {Board} from "../../../dnd/DnDTestMain";

export const boardDocumentView: DocumentView = {
    renderer: (context) => {
        return (
            <DndProvider backend={HTML5Backend} children={
                <Board/>
            }/>
        );
    }
}
