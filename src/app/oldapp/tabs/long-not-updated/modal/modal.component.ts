import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from '../../../service/helper.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    // Data passed in by componentProps
    @Input() node: {};
    treeData: {};
    templateToShow = 'general';

    constructor(
        private modalController: ModalController,
        private navParams: NavParams,
        public helperService: HelperService,
    ) {
        // componentProps can also be accessed at construction time using NavParams
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.treeData = this.navParams.get('node');
        console.log(this.treeData)
    }

    async myDismiss() {
        const result: Date = new Date();

        await this.modalController.dismiss(result);
    }

    onNavigate(url) {
        window.open(url, '_blank');
    }
}