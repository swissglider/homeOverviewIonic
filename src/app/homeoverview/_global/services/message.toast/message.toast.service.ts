import { Injectable, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { MessageQuery } from '../../../app/store/message/messages.query';
import { Message, MessageScope, MessageType } from '../../../app/store/message/messages.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { isArray } from 'util';

@Injectable({ providedIn: 'root' })
export class MessageToastService implements OnDestroy {

    private subscriptions: Subscription[] = [];

    constructor(
        public toastController: ToastController,
        private messageQuery: MessageQuery
    ) {
        this.subscriptions.push(this.messageQuery.selectEntityAction().pipe(distinctUntilChanged()).subscribe(action => {
            if(!action || !action.ids) { return }
            action.ids.forEach((id) => {
                if (this.messageQuery.hasEntity(id)) {
                    const message: Message = this.messageQuery.getEntity(id);
                    this.manageToast(message);
                }
            });
        }));
    }

    private manageToast(message: Message) {

        const doErrorToast = async (message: Message) => {
            let toast = await this.toastController.create({
                header: MessageScope[message.scope],
                message: '\n\t' + message.text,
                position: 'top',
                color: message.color,
                buttons: [
                    {
                        side: 'start',
                        icon: message.icon,
                        text: '',
                        handler: () => { }
                    }, {
                        text: 'Ok',
                        role: 'cancel',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    }
                ]
            });
            toast.present();
            toast.onDidDismiss().then()
        }

        const doInfoToast = async (message: Message) => {
            let msg = message.text
            const toast = await this.toastController.create({
                color: message.color,
                message: msg,
                duration: 2000
            });
            toast.present();
        }
        (message.type === MessageType.ERROR) ? doErrorToast(message) : doInfoToast(message);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe()
        });
    }
}