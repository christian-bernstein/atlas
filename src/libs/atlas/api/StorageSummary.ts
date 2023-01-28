import {StorageArchetypeSummary} from "./StorageArchetypeSummary";

export type StorageSummary = {
    unixCreationTimestamp: number,
    usedBytes: number,
    fileCount: number,
    archetypeSummaries: Array<StorageArchetypeSummary>
}
