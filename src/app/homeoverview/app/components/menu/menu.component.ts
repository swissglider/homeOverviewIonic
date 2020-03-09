import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { MenuModalComponent } from './modal/menu.modal.component';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet
    // public router: Router
  ) { }


  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: MenuModalComponent,
      swipeToClose: true,
      componentProps: {},
      // presentingElement: this.routerOutlet.nativeEl,
      animated: false
    });
    modal.onDidDismiss().then((detail) => {
      if (detail !== null) {
      }
    });
    return await modal.present();
  }
}