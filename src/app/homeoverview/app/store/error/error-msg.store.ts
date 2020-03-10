import { Injectable } from '@angular/core';
import { ErrorMsg } from './error-msg.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

/** Error Msg State */
export interface ErrorMsgState extends EntityState<ErrorMsg, string> {}

/** Error Msg Store.. all the Errors/Exceptions has to be send to the store */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ErrorMsgState' })
export class ErrorMsgStore extends EntityStore<ErrorMsgState> {

  /** @ignore */
  constructor() {
    super();
  }

  /**
   * get Random ID for ErrorStore handling
   *
   * @returns {string} randomID
   */
  public RID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
}

}

