import {IWizardEngine} from "../IWizardEngine";
import {WizardEngineInstruction} from "../WizardEngineInstruction";
import {AtlasDocument} from "../../../data/AtlasDocument";
import {v4} from "uuid";
import {metaWizardSubRoutine} from "../wizards/meta/MetaWizardSubRoutine";
import {AtlasMain} from "../../../AtlasMain";

export class DefaultWizardEngine implements IWizardEngine {

    async run(instruction: WizardEngineInstruction) {
        let document: Partial<AtlasDocument> = {
            ...instruction.documentBase,
            id: v4(),
        };

        if (!(instruction.skipMetaWizard ?? false)) {
            document = {
                ...document,
                ...await metaWizardSubRoutine.run(document, {
                    documentBase: document,
                    component: instruction.component,
                    currentFolder: instruction.currentFolder,
                    mainEngineInstruction: instruction,
                    view: instruction.view
                })
            };
        }
        for (const sub of instruction.subRoutines ?? []) {
            document = {
                ...document,
                ...await sub.run(document, {
                    documentBase: document,
                    component: instruction.component,
                    currentFolder: instruction.currentFolder,
                    mainEngineInstruction: instruction,
                    view: instruction.view
                })
            };
        }
        const finalized = document as AtlasDocument;
        try {
            AtlasMain.atlas(atlas => {
                const api = atlas.api();
                const docID = instruction.currentFolder.id;
                api.createDocumentInFolder(docID, finalized);
                api.overwriteDocumentBody(docID, "");
            });
            instruction.onSetupComplete?.(finalized);
        } catch (e) {
            console.error(e);
        }
    }
}
