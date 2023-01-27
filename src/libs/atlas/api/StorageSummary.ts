export type StorageSummary = {
    unixCreationTimestamp: number,
    usedBytes: number,
    fileCount: number,
    fileTypeSummaries: Array<{
        fileType: string,
        fileCount: number,
        usedBytes: number
    }>
}
