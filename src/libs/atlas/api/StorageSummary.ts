import {DocumentArchetype} from "./DocumentArchetype";

export type StorageSummary = {
    unixCreationTimestamp: number,
    usedBytes: number,
    fileCount: number,
    fileTypeSummaries: Array<{
        archetype: DocumentArchetype,
        fileCount: number,
        usedBytes: number
    }>
}
