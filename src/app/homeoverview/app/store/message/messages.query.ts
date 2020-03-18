import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MessageStore, MessageState } from './messages.store';

@Injectable({ providedIn: 'root' })
export class MessageQuery extends QueryEntity<MessageState> {

  /** @ignore */
  constructor(protected store: MessageStore) {
    super(store);
  }

}
