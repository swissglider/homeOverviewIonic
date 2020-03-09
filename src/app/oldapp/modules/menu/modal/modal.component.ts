import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { MenuModel } from '../menu.model';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    // Data passed in by componentProps
    @Input() menu: MenuModel;

    constructor(
        private modalController: ModalController,
        private navCtrl: NavController,   
    ) {
        // componentProps can also be accessed at construction time using NavParams
    }

    ngOnInit() {
    }

    ionViewWillEnter() {}

    async myDismiss() {
        const result: Date = new Date();
        await this.modalController.dismiss(result);
    }

    navigate(path){
        // this.router.navigate([path]);
        this.navCtrl.navigateForward(path, {animated: false});
        this.myDismiss();
    }
}