/** this is the Model for a NewIoBState used together with the NewIOBStore. Used to change a value on ioBroker */
export interface NewIOBState {
  /** id that has to be changed on the ioBroker */
  id: number | string;
  /** new Value that has to be changed on the ioBroker */
  val: number | string | boolean | object;
}

/** @ignore */
export function createNewIOBState(params: Partial<NewIOBState>) {
  return {

  } as NewIOBState;
}
