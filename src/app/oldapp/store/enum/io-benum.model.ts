/** represents an Enum on ioBroker --> should not be used by component itself */
export interface IoBEnum {
  /** id */
  id: string;
  /** _id same as id */
  _id?: string;
  /** common */
  common?: {
    /** members */
    members?: string[];
    /** all members, resolved member enunms */
    allMembers?: string[];
    /** name can be a string or an enum with names as string in different languages */
    name?: string | object;
    /** unit of the value */
    unit?: string;
    /** type */
    type?: string;
    /** writable */
    write?: boolean;
    /** readable */
    read?: boolean;
    /** icon */
    icon?: string;
    /** color */
    color?: string;
    /** role */
    role?: string;
  };
  /** type */
  type?: string;
  native?: {};
}

/** @ignore */
export function createIoBEnum(params: Partial<IoBEnum>) {
  return {

  } as IoBEnum;
}
