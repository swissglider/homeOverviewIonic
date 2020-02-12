/**
 * Naming convention:
 *  -    LevelObject    => The Level Description (only) Input from the application ==> will be transformed into an LevelStruct
 *  -    LevelStruct    => The Level Struct presents the object for the GUI with all the needed Information and also will update them self
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
export interface ILevelStruct {
    id: string,
    name?: string | object,
    subLevels?: ILevelStruct[],
    subLevelFilters?: string[],
    elementStates?: ElementStates,
}

interface ElementStates {
    name: string | object,
    functionStates: {
        [key: string]: {                // key = functionID
            [key: string]: string[],    // key = enumID         value = stateIDs
        },
    },
}

export enum levelIDCases {
    instances = 0,
    channels = 1,
    devices = 2,
    states = 3,
    enums = 4,
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

export interface IInputLevelObject {
    id?: string,
    // name?: string | object,
    subLevel?: IAdminLevelStruct,
    subLevelFilters?: string[],
}