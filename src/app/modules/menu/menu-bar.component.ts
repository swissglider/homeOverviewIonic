import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { MenuModel } from './menu.model';
import { IconsService } from 'src/app/service/icons.service';


@Component({
  selector: 'app-menu-bar',
  templateUrl: 'menu-bar.component.html',
  styleUrls: ['menu-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBarComponent {

  @Input('menuTitle') menuTitle?: string;
  @Input('icon') icon?: string;
  @Input() iconImg?:string;
  @Input('menu') menu: MenuModel;

  constructor(
    private router: Router,
    public modalController: ModalController,
    public iconsService: IconsService,
  ) {}

  openMenu(){
    this.router.navigate(['/tabs/menu'])
  }
  
  async presentModal(menu) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        'menu': menu,
      }
    });
    modal.onDidDismiss().then((detail) => {
      if (detail !== null) {
      }
    });
    return await modal.present();
  }

  // openMenu(){
  //   this.router.navigate(['/tabs/menu'])
  // }

}