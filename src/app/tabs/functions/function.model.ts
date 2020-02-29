export interface IObjectViewInputDev {
    viewInputStructDev: IOjectViewInputStructDev;
    functionFilter: string[];
}

export interface IOjectViewInputStructDev {
    objectID: string;
    objectsToSelect: string[]
    subObjectFilteredID: string[];
    childViewInputStructDev?: IOjectViewInputStructDev;
    filterChildViewFunction?: (parentSelectedObjectID:string, iOjectViewInputStructDev: IOjectViewInputStructDev) => string[];
}