/** represents an Object on ioBroker --> should not be used by component itself */
export interface IoBObject {
  /** id */
  id: string;
  /** _id same as id */
  _id?: string;
  /** common */
  common?: {
    /** members */
    members?: string[];
    /** name can be a string or an object with names as string in different languages */
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
  ts?: number;
}

/** @ignore */
export function createIoBObject(params: Partial<IoBObject>) {
  return {

  } as IoBObject;
}
