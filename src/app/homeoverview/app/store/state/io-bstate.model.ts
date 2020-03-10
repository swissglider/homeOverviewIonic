/** represent a state on ioBroker */
export interface IoBState {
  /** id */
  id: string;
  /** value */
  val: number | string | boolean | object;
  /** last change in ms */
  lc: number;
  /** timestamp in ms */
  ts: number;
}

/** @ignore */
export function createIoBState(params: Partial<IoBState>) {
  return {

  } as IoBState;
}
