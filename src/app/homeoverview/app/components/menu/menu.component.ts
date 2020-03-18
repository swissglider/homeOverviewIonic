import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController} from '@ionic/angular';
import { MenuModalComponent } from './modal/menu.modal.component';
import { IOBrokerService } from '../../../_global/services/iobroker.service/iobroker.service';
import { OutputButtonValue, InputButtons } from './menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() buttonReturn = new EventEmitter<OutputButtonValue>();
  @Input() inputButtons: InputButtons;

  trackByButtonID = (index: number, item: any) => item.buttonID;

  constructor(
    public route: ActivatedRoute,
    public modalController: ModalController,
    public ioBroverService: IOBrokerService,
  ) {}

  ngAfterViewInit() { }

  ngOnInit(): void {  }

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

  ngOnDestroy() {}

  outputButtonReturn(id:string, value:any){
    console.log(id, value);
    this.buttonReturn.emit({buttonID: id, value: value});
  }


}