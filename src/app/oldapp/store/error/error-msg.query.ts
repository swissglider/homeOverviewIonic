import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ErrorMsgStore, ErrorMsgState } from './error-msg.store';

/** used for quering the Error Msg Store */
@Injectable({ providedIn: 'root' })
export class ErrorMsgQuery extends QueryEntity<ErrorMsgState> {

  /** @ignore */
  constructor(protected store: ErrorMsgStore) {
    super(store);
  }

}
