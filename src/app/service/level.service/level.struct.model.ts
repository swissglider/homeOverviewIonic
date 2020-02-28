import { Observable } from 'rxjs';

/**
 * Naming convention:
 *  -    LevelObject    => The Level Description (only) Input from the application ==> will be transformed into an LevelStruct
 *  -    LevelStruct    => The Level Struct presents the object for the GUI with all the needed Information and also will update them self
 *  -    IAppStates     => StatesStruct that will be used on the GUI in the end
 *  -    AdminLevelStruct => Only used in the admin to generate a LevelObject
 *  -    Level          => corrent level of the ILevelStruct
 *  -    RootLevel      => all EnumRootDomain or RootInstance
 *  -    SubLevel       => all Defined SubLevel, must follow the rules described below
 *  -    SubLevelFilter => if empty no Filter. Filter are direct EnumSubDomain or Members. Only the one in the Filter will be accepted for SubLevels
 *  -    EnumRootDomain => all enums only have one points (normally they have no members)
 *  -    EnumSubDomain  => all enums that have two points. Sub because they are a subEnumDomain of EnumRootDomain (normally they have members)
 * 
 * 
 * SubLevel Rules
 *  -    subLevel ID's must be in the enumSubDomain or in any of the enumSubDomain/members -members 
 *         or any of the levelIDCases it can be 'instances' 'channels', 'devices', 'states', 'enums'; than all ... for all enumSubDomains/members will be taken
 * 
 * 
 */
export interface IInputLevelObject {
    id?: string,
    // name?: string | object,
    subLevel?: IAdminLevelStruct,
    subLevelFilters?: string[],
}

export interface ILevelStruct {
    id: string,
    level: number,
    // members: ILevelStruct[],
    elementStates: ElementStates,
    totalOpen: boolean,
    getName: () => string | Object,
    setNewInputLevelObject: (lo: IInputLevelObject) => void,
    setNewValueSelection: (valueSelectionID: string, valueSelectionFilters: string[]) => void,
    getBase64Icon: () => string,
    getParentMemberID: () => string;
    getMembers: () => ILevelStruct[];
    hasMembers: () => boolean;
}

export interface IAppStates {
    name: string | Object,
    type?: string,
    value: ElementStates,
}

export interface ElementStates {
    [functionID: string]: IElementState,
}

export interface IElementState {
    value$: Observable<number | string | boolean>,
    uniqID: string,
    init: () => void;
    getSelectValueSelection: () => string,
    getSelectValueSelectionName: () => string | Object,
    getStateIDs: () => string[];
    getRole: () => string;
    getWrite: () => boolean;
    getRead: () => boolean;
    getType: () => string;
    getUnit: () => string;
    getBase64IconNeutral: (size?: number) => string;
    getBase64IconOn: (size?: number) => string;
    getBase64IconOff: (size?: number) => string;
    getBase64Icon: (fall: boolean | string, size?: number) => string; // fall can be true/false/'neutral'
    setNewState: (value: number | string | boolean) => void;
    // selectValue: () => Observable<number | string | boolean>,
}

export interface IAdminLevelStruct {
    id?: string,
    level: number,
    subLevel?: IAdminLevelStruct,
    availableLevelIDs?: string[],
    subLevelFilters?: string[],
    subLevelAvailableFilters?: string[],
    parent: IAdminLevelStruct
}

export enum levelIDCases {
    instances = 0,
    channels = 1,
    devices = 2,
    states = 3,
    all = 4,
}