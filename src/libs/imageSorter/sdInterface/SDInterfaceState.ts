import {SDAPIRequestData} from "../SDAPIRequestData";

export type SDInterfaceState = {
    phase: "generating" | "default",
    resultImage?: string,
    previewImage?: string,
    progress?: any,
    debouncedRequestSaver: (req: SDAPIRequestData) => void,
    activeTab: string,

    updateRequest?: (delta: Partial<SDAPIRequestData>) => void
}
