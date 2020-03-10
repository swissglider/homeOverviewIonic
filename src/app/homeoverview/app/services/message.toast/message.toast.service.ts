import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ErrorMsgQuery } from '../../store/error/error-msg.query';
import { ErrorMsg } from '../../store/error/error-msg.model';

@Injectable({ providedIn: 'root' })
export class MessageToastService {

    private toasts: any[] = [];

    constructor(
        public toastController: ToastController,
        private errorMsgQuery: ErrorMsgQuery
    ) {
        this.errorMsgQuery.selectEntityAction().subscribe(action => {
            action.ids.forEach((id) => {
                if (this.errorMsgQuery.hasEntity(id)) {
                    const erroMsg: ErrorMsg = this.errorMsgQuery.getEntity(id);
                    this.manageToast(erroMsg)
                }
            });
        });
    }

    private manageToast(erroMsg: ErrorMsg) {

        const doErrorToast = async (erroMsg: ErrorMsg, icon, color) => {
            let toast = await this.toastController.create({
                header: erroMsg.scope + ' :' + icon + ': ' + erroMsg.text,
                message: '\n\t' + erroMsg.action,
                position: 'top',
                color: color,
                buttons: [
                    {
                        side: 'start',
                        icon: icon,
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

        const doInfoToast = async (erroMsg: ErrorMsg, color) => {
            const toast = await this.toastController.create({
                color: color,
                message: `${erroMsg.text} : ${erroMsg.action}`,
                duration: 2000
            });
            toast.present();
        }

        let icon: string;
        let color: string = erroMsg.type;
        switch (erroMsg.type) {
            case 'info':
                color = 'primary'
                doInfoToast(erroMsg, color)
                console.info(erroMsg);
                break;
            case 'success':
                doInfoToast(erroMsg, color)
                console.info(erroMsg);
                break;
            case 'warning':
                icon = 'warning-sharp'
                doErrorToast(erroMsg, icon, color);
                console.error(erroMsg);
                break;
            case 'danger':
                icon = 'alert-sharp';
                doErrorToast(erroMsg, icon, color);
                console.error(erroMsg);
                break;
        }
    }
}