import {WizardRoutine} from "../../WizardRoutine";
import {WizardRoutineCard} from "../../../../components/documentWizard/WizardRoutineCard";
import {DefaultWizardEngine} from "../../engines/DefaultWizardEngine";
import {DocumentType} from "../../../../data/DocumentType";
import {WizardSubRoutine} from "../../WizardSubRoutine";
import {AtlasDocument} from "../../../../data/AtlasDocument";
import {WebsiteDocumentArchetype} from "../../../../data/documentArchetypes/WebsiteDocumentArchetype";
import React from "react";

export const atlasBoardWizardRoutine: WizardRoutine = {
    title: "Board",
    description: "Create atlas board",
    tags: ["Save", "Website"],
    previewCard: (onSelectCallback) => (
        <WizardRoutineCard
            title={"Board"}
            description={"Create atlas board"}
            tooltip={"Create new atlas board"}
            onSelect={() => onSelectCallback()}
        />
    ),
    run: (view, currentFolder, component, onSetupComplete) => {
        return new DefaultWizardEngine().run({
            view: view,
            component: component,
            currentFolder: currentFolder,
            onSetupComplete: onSetupComplete,
            wizardEngineID: "default",
            documentBase: {
                documentType: DocumentType.ATLAS_BOARD
            }
        });
    }
}
