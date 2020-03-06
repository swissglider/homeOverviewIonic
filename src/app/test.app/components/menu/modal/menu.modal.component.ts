import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-modal',
    templateUrl: './menu.modal.component.html',
    styleUrls: ['../menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuModalComponent implements OnInit {

    menu: {};
    menuItems: {};

    trackByPath = (index: number, item: any) => item.path;

    constructor(
        private modalController: ModalController,
        public route: ActivatedRoute,
        public router: Router,
    ) { }

    ngOnInit(): void {
        this.menu = this.router.config.find(e => e.path === 'app').children.find(e => e.path === '').data.menu;
        this.menuItems = this.router.config.find(e => e.path === 'app').children.find(e => e.path === '').data.apps;
    }

    async myDismiss() {
        const result: Date = new Date();
        await this.modalController.dismiss(result);
    }

    navigate(path){
        this.router.navigate([path]);
        this.myDismiss();
    }
}