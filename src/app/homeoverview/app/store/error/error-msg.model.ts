export enum ErrorMsgSeverity {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  LOG = 3,
  SUCCESS = 4,
  WARN = 5,
  ERROR = 6,
  FATAL = 7,
  OFF = 8,
}

export enum ErrorMsgScope {
  LOCAL,
  GLOBAL,
}

export enum ErrorMsgLogging {
  CONSOLE,
}

/** Specifies an errorMsg used within the Error Msg Store */
export interface ErrorMsg {
  /** id */
  id?: string;
  /** id */
  timestamp?: number;
  /** severity of the error (can be: info, warning, success, danger) */
  severity: ErrorMsgSeverity;
  /** text for the error */
  text: string;
  /** action the user should take */
  action?: string;
  /** scope the error belongs to */
  scope: ErrorMsgScope;
  logging?: ErrorMsgLogging[];
  stack?: string;
  errorcode?: string;
  color?: string;
  icon?: string; 
}

/** @ignore */
export function createErrorMsg(params: Partial<ErrorMsg>) {
  return {

  } as ErrorMsg;
}
