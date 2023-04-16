export type ImageMetaData = {
    prompt: string,
    promptShards: Array<string>,
    negativePrompt: string,
    negativePromptShards: Array<string>,
    meta: Map<string, string>
}
