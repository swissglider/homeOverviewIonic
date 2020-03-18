import { Message, MessageType } from './messages.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface MessageState extends EntityState<Message, string> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'MessageState' })
export class MessageStore extends EntityStore<MessageState> {

  /** @ignore */
  constructor() {
    super();
    this.akitaPreAddEntity = this.akitaPreAddEntity.bind(this);
    this.addNewMessage = this.addNewMessage.bind(this);
  }

  akitaPreAddEntity(message: Message): Message {
    message.id = this.RID();
    message.timestamp = new Date().getTime();
    switch (message.type) {
      case MessageType.INFO:
        message.color = (message.color) ? message.color : 'primary';
        message.icon = (message.icon) ? message.icon : 'information-sharp';
        break;
      case MessageType.SUCCESS:
        message.color = (message.color) ? message.color : 'success';
        message.icon = (message.icon) ? message.icon : 'checkmark-circle-sharp';
        break;
      case MessageType.ERROR:
        message.color = (message.color) ? message.color : 'danger';
        message.icon = (message.icon) ? message.icon : 'alert-sharp';
        break;
      default:
        message.color = (message.color) ? message.color : 'danger';
        message.icon = (message.icon) ? message.icon : 'alert-sharp';
    }
    return message;
  }

  /**
   * get Random ID for ErrorStore handling
   *
   * @returns {string} randomID
   */
  public RID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  addNewMessage(message: Message) {
    this.add(message);
  }

}

