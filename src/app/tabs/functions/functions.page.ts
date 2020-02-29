import { Component, OnInit, NgZone } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { IOBrokerService } from 'src/app/service/io-broker.service';
import { LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { HelperService } from 'src/app/service/helper.service';
import { KeyValue } from '@angular/common';
import { IconsService } from 'src/app/service/icons.service';
import { ModalComponent } from './modal/modal.component';
import { ModalDynamicComponent } from './modal/modal.dynamic.component';
import { IOjectViewInputStructDev, IObjectViewInputDev } from './function.model'


@Component({
  selector: 'app-functions',
  // templateUrl: 'functions.page.html',
  templateUrl: 'tmp.html',
  styleUrls: ['functions.page.scss']
})
export class FunctionsPage implements OnInit {

  objectViewInputDev: IObjectViewInputDev = {
    viewInputStructDev: {
      objectID: 'enum.area',
      objectsToSelect: ['enum.area', 'enum.floor', 'enum.rooms'],
      subObjectFilteredID: [],
      childViewInputStructDev: {
        objectID: 'all',
        objectsToSelect: ['enum.floor', 'enum.rooms', 'all'],
        subObjectFilteredID: [],
      },
      filterChildViewFunction: (parentSelectedObjectID: string, structDev: IOjectViewInputStructDev): string[] =>
        structDev.childViewInputStructDev.objectsToSelect.filter((entity, index) => index >= structDev.objectsToSelect.indexOf(parentSelectedObjectID)),
    },
    functionFilter: ['enum.functions.light'],
  }

  root = {
    rootObjectViewStruct: null,
  }

  private loadingSpinner;
  loaded = false;
  templateToShow = 'overview';

  constructor(
    public pageService: PageService,
    private ioBrokerService: IOBrokerService,
    private ngZone: NgZone,
    public helperService: HelperService,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public iconsService: IconsService,
    public modalController: ModalController,
  ) { }

  /** @ignore */
  ngOnInit(): void {
  }

  ionViewDidEnter() {
  }

  ionViewWillEnter() {
    this.init();
  }

  private async init() {
    this.templateToShow = 'overview';
    await this.presentLoading();
    this.ioBrokerService.selectLoaded().subscribe(e => {
      if (e === false) { }
      if (e === true) {
        this.loaded = true;
        this.loadingSpinner.dismiss();
        this.functionSelection();
      }
    })
  }

  async presentLoading() {
    this.loadingSpinner = await this.loadingController.create({
      message: 'loading ...'
    });
    if (!this.loaded) {
      await this.loadingSpinner.present();
    }
  }

  keyAscOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    // console.log(a, b)
    return 1;
  }

  async functionSelection() {
    await this.presentLoading();
    // this.presentSelectionSheet();
    this.presentSelectionSheetDynamic();
  }

  async presentSelectionSheet() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        inputDev: this.objectViewInputDev,
      }
    });
    modal.onDidDismiss().then((detail) => {
      this.ngZone.run(() => {
      })
    });
    return await modal.present();
  }

  async presentSelectionSheetDynamic() {
    const modal = await this.modalController.create({
      component: ModalDynamicComponent,
      componentProps: {
        // inputLevelObject: JSON.parse(this.testString),
        inputLevelObject: JSON.parse(this.testString4),
        valueSelectionID: 'enum.functions',
        // valueSelectionFilters: ["enum.functions.light","enum.functions.rain"],
        // valueSelectionFilters: ["enum.functions.light"],
      }
    });
    modal.onDidDismiss().then((detail) => {
      this.ngZone.run(() => {
        console.log(detail)
      })
    });
    return await modal.present();
  }

  sortChildren(a, b): number {
    let nameA = a.id.toUpperCase(); // Groß-/Kleinschreibung ignorieren
    let nameB = b.id.toUpperCase(); // Groß-/Kleinschreibung ignorieren
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // Namen müssen gleich sein
    return 0;
  }

  test() {
    console.log(this.root.rootObjectViewStruct)
  }

  testString = `
    {
      "id": "enum.floor",
      "subLevelFilters": [
        "enum.floor.3-erdgeschoss",
        "enum.floor.2-mittelgeschoss",
        "enum.floor.4-kellergeschoss"
      ],
      "subLevel": {
        "id": "shelly.0",
        "subLevelFilters": [
          "shelly.0.SHSW-1#769903#1",
          "shelly.0.SHSW-25#B8B0EC#1"
        ],
        "subLevel": {
          "id": "states",
          "subLevelFilters": []
        }
      }
    }
  `

  testString2 = `
    {
      "id": "enum.area",
      "subLevelFilters": [
        "enum.area.inside_home"
      ],
      "subLevel": {
        "id": "enum.floor",
        "subLevelFilters": [
          "enum.floor.1-dachgeschoss",
          "enum.floor.3-erdgeschoss",
          "enum.floor.2-mittelgeschoss"
        ],
        "subLevel": {
          "id": "states",
          "subLevelFilters": []
        }
      }
    }
  `
  testString3 = `
    {
      "id": "enum.floor",
      "subLevelFilters": []
    }
  `

  testString4 = `
    {
      "id": "enum.area",
      "subLevelFilters": [],
      "subLevel": {
        "id": "enum.floor",
        "subLevelFilters": [],
        "subLevel": {
          "id": "enum.rooms",
          "subLevelFilters": []
        }
      }
    }
  `

}
