export enum MessageType {
  INFO,
  SUCCESS,
  ERROR,
}

export enum MessageScope {
  LOCAL,
  GLOBAL,
}

/** Specifies an Message used within the Error Msg Store */
export interface Message {
  id?: string;
  timestamp?: number;
  type: MessageType;
  scope: MessageScope;
  text: string;
  color?: string;
  icon?: string; 
  callback?: (status:string)=>void;
}

/** @ignore */
export function createMessage(params: Partial<Message>) {
  return {

  } as Message;
}
