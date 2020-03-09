import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

@Component({
    selector: 'app-modal',
    templateUrl: './menu.modal.component.html',
    styleUrls: ['../menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuModalComponent implements OnInit {

    menu: {};
    objectItems: [];
    folderItems: [];
    additionalLinks: [];
    folders: {[functionID: string]:{values:{title:string, order:number, fullPath:string}[], params: {}}};

    trackByPath = (index: number, item: any) => item.fullPath;

    constructor(
        private modalController: ModalController,
        public route: ActivatedRoute,
        public router: Router,
        private navCtrl: NavController,
    ) { }

    ngOnInit(): void {
        this.menu = this.router.config.find(e => e.path === 'app').data.menu;
        this.objectItems = this.router.config.find(e => e.path === 'app').data.components;
        this.folderItems = this.router.config.find(e => e.path === 'app').data.folders;
        this.additionalLinks = this.router.config.find(e => e.path === 'app').data.additionLinks;
        this.folders = {};
        this.folderItems.forEach(folder => {
            let tempCompE = this.objectItems.filter(e => e['data']['folder'] === folder['menuID']).map(e => {
                let tempObj = {
                    title: e['data']['title'],
                    order: e['data']['order'],
                    image: e['data']['image'],
                    image_selected_true: e['data']['image_selected_true'],
                    image_selected_false: e['data']['image_selected_false'],
                    fullPath: e['data']['fullPath']
                };
                tempObj['isActive'] = (this.router.url === '/' + e['data']['fullPath']);
                return tempObj;
            });
            let tempAddE = this.additionalLinks.filter(e => e['folder'] === folder['menuID']).map(e => {
                return e;
            });
            this.folders[folder['menuID']] = {values:[...tempCompE, ...tempAddE].sort((a,b) => a['order']-b['order']), params: folder};
        });
    }

    async myDismiss() {
        const result: Date = new Date();
        await this.modalController.dismiss(result);
    }

    navigate(path:string){
        this.navCtrl.navigateForward(path, {animated: false});
        this.myDismiss();
    }
}