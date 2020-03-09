/** Specifies an errorMsg used within the Error Msg Store */
export interface ErrorMsg {
  /** id */
  id: string;
  /** severity of the error (can be: info, warning, success, danger) */
  type: 'info' | 'warning' | 'success' | 'danger';
  /** text for the error */
  text: string;
  /** action the user should take */
  action: string;
  /** scope the error belongs to */
  scope: 'local' | 'global' | 'debug' | 'info';
}

/** @ignore */
export function createErrorMsg(params: Partial<ErrorMsg>) {
  return {

  } as ErrorMsg;
}
