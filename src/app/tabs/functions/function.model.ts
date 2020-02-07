import { AppStatesModel } from 'src/app/modules/states_view/app.states/app.states.model';

export type GenerateFunctionAppState = (functionAppStates:AppStatesModel) => void;

export interface IObjectViewStruct {
    objectID: string;
    name: string | object;
    // children?: {};  // ==> enumQuery.getAllChildAsViewStructWithinParent(parentID:string, filterEnumID:string[]) => filterEnumID == functional and grandXParents etc
    children?: IObjectViewStruct[];  // ==> enumQuery.getAllChildAsViewStructWithinParent(parentID:string, filterEnumID:string[]) => filterEnumID == functional and grandXParents etc
                                     // ==> enumQuery.getAllChildDevicesRecursiveAsViewStructWithinParent(parentID:string, filterEnumID:string[]) => filterEnumID == functional and grandXParents etc
    functionAppStates: AppStatesModel; // ==> enumQuery.getAllDeviceStatesRecursiveSortedByFunctionsFromParent(parentID:string, functionIDs:string[], filterEnumID:string[]) => filterEnumID == functional and grandXParents etc
    generateFunctionAppState?: GenerateFunctionAppState;
}

// ======================================================================================================================

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