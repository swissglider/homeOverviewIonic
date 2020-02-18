import { Component, OnInit, NgZone } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { AppStatesModel } from 'src/app/modules/states_view/app.states/app.states.model';
import { IOBrokerService } from 'src/app/service/io-broker.service';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';
import { LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { IoBEnum } from 'src/app/store/enum/io-benum.model';
import { Observable, combineLatest, of, concat, merge } from 'rxjs';
import { HelperService } from 'src/app/service/helper.service';
import { KeyValue } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IconsService } from 'src/app/service/icons.service';
import { ModalComponent } from './modal/modal.component';
import { ModalDynamicComponent } from './modal/modal.dynamic.component';
import { IObjectViewStruct, IOjectViewInputStructDev, IObjectViewInputDev, GenerateFunctionAppState } from './function.model'
import { map, filter, concatAll, expand, combineAll, concatMap } from 'rxjs/operators';
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { LevelStructService } from './level.struct.service';


type enumPair = { id: string; name: string | object; members: string[] };


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
    private enumQuery: IoBEnumQuery,
    private objectQuery: IoBObjectQuery,
    public helperService: HelperService,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    public iconsService: IconsService,
    public modalController: ModalController,
    private levelStructService: LevelStructService,
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
        // console.log(this.levelStructService.getFullInputLevelStruct('enum.functions.light', 3));
        // console.log(this.levelStructService.getFullInputLevelStruct('enum.area', 3));
        this.functionSelection();
        // this.checkUrlParameter();
      }
    })
  }

  private checkUrlParameter() {
    let allSet: boolean[] = [];
    this.route.queryParams.subscribe(params => {
      // => toDo check input params from HTML and create objectViewInputDev
      allSet.push(false) // ==> test reasons
      if (allSet.every(c => c)) {
        this.loadObjectStruct();
      } else {
        this.functionSelection();
      }
    });
  }

  private async loadObjectStruct() {
    this.generateRootObjectViewStruct(this.root, this.objectViewInputDev)
  }

  // ===> start ----------------------------------------------------------------------------------------------------------- <=== //

  private allIDsInTheFilteredFunctions1: string[] = [];
  private functionFilteredIDs: string[] = [];
  private allIDsInTheFilteredFunctions: { [key: string]: { id: string, name: string | object, members: string[] } } = {};

  private generateRootObjectViewStruct(root, inputStruct: IObjectViewInputDev) {
    this.functionFilteredIDs = inputStruct.functionFilter;

    // subscribe all function(id) that are selected
    this.enumQuery.selectAll({ filterBy: entity => this.functionFilteredIDs.includes(entity.id) }).pipe(map(enu => {
      return enu.reduce((acc, curr) => acc.concat(curr.common.members), []);
    }));
    this.enumQuery.selectMany(this.functionFilteredIDs, entity => {
      return {
        id: entity.id,
        name: entity.common.name,
        members: entity.common.members,
      }
    }).subscribe(funtionStructs => {
      this.ngZone.run(() => {
        funtionStructs.forEach(funtionStruct => {
          this.allIDsInTheFilteredFunctions[funtionStruct.id] = funtionStruct;
        });

        // subscribe level1(id/name) i.e. enum.rooms / enum.floor / enum.area etc...
        this.enumQuery.selectEntity(inputStruct.viewInputStructDev.objectID, entity => { return { id: entity.id, name: entity.common.name } }).subscribe(idName => {
          root.rootObjectViewStruct = {
            objectID: idName.id,
            name: idName.name,
            functionAppStates: []
          }
          root.rootObjectViewStruct.generateFunctionAppState = (functionAppStates: AppStatesModel) => {
            this.ngZone.run(() => {
              Object.keys(functionAppStates).forEach(key => {
                root.rootObjectViewStruct.functionAppStates[key] = functionAppStates[key];
              });
            });
          };
          this.generateChildIObjectViewStruct(root.rootObjectViewStruct, inputStruct.viewInputStructDev.childViewInputStructDev);
          // root.rootObjectViewStruct.children = inputStruct.viewInputStructDev.subObjectFilteredID.map(entity => this.generateObjectViewStruct(
          //   entity,
          //   inputStruct.viewInputStructDev.childViewInputStructDev,
          //   root.rootObjectViewStruct.generateFunctionAppState,
          // ));
        });
      });
    })
  }

  // private generateObjectViewStruct(
  //   objectID: string,
  //   childViewInputStructDev: IOjectViewInputStructDev,
  //   parentGenerateFunctionAppState: GenerateFunctionAppState,
  // ): IObjectViewStruct {
  //   let childObjectViewStruct: IObjectViewStruct = {
  //     objectID: objectID,
  //     name: '',
  //     functionAppStates: {},
  //   };
  //   this.ngZone.run(() => {
  //     if (this.enumQuery.hasEntity(objectID)) {
  //       // <------------------------------------------------------------------------------------> //
  //       // if it is an enum object 

  //       // subscribe levelx0(id, name)
  //       this.enumQuery.selectEntity(objectID, entity => { return { id: entity.id, name: entity.common.name } }).subscribe(idName => {
  //         childObjectViewStruct.objectID = idName.id;
  //         childObjectViewStruct.name = idName.name;
  //         if (childViewInputStructDev) {
  //           // <------------------------------------------------------------------------------------> //
  //           // if there are child views

  //           childObjectViewStruct.generateFunctionAppState = (functionAppStates: AppStatesModel) => {
  //             this.ngZone.run(() => {
  //               Object.keys(functionAppStates).forEach(key => {
  //                 childObjectViewStruct.functionAppStates[key] = functionAppStates[key];
  //               });
  //               parentGenerateFunctionAppState(childObjectViewStruct.functionAppStates);
  //             });
  //           };
  //           let allMembers = { allMembersToAdd: [] };
  //           this.addAllChildIDRecursiveWithinFunctionAndReturnTrueIfHasWithinFunction(idName.id, allMembers);
  //           // different ways to create the childen
  //           if (childViewInputStructDev.objectID == 'all') {
  //             // <------------------------------------------------------------------------------------> //
  //             // if 'all' is selected as child
  //             let memberIDs = allMembers.allMembersToAdd.filter(e => !e.startsWith('enum.'));
  //             // let members = this.allIDsInTheFilteredFunctions.filter(e => memberIDs.some(a => e.startsWith(a)));
  //             childObjectViewStruct.children = memberIDs.map(entity => this.generateObjectViewStruct(
  //               entity,
  //               childViewInputStructDev.childViewInputStructDev,
  //               childObjectViewStruct.generateFunctionAppState,
  //             ));

  //           } else if (childViewInputStructDev.subObjectFilteredID.length === 0) {
  //             // <------------------------------------------------------------------------------------> //
  //             // id there is no filter set, all elements are used / with child
  //             this.enumQuery.selectAll({ filterBy: entity => entity.id.startsWith(childViewInputStructDev.objectID + '.') }).pipe(map(enuArr => {
  //               return enuArr.filter(enu => allMembers.allMembersToAdd.includes(enu.id)).map(enu => enu.id);
  //             })).subscribe(memberIDs => {
  //               childObjectViewStruct.children = memberIDs.filter(id => memberIDs.includes(id)).map(entity => this.generateObjectViewStruct(
  //                 entity,
  //                 childViewInputStructDev.childViewInputStructDev,
  //                 childObjectViewStruct.generateFunctionAppState,
  //               ));
  //             });
  //           } else {
  //             // <------------------------------------------------------------------------------------> //
  //             // standard with child and filter and not 'all'
  //             childObjectViewStruct.children = childViewInputStructDev.subObjectFilteredID
  //               .filter(id => allMembers.allMembersToAdd.includes(id)).map(entity => this.generateObjectViewStruct(
  //                 entity,
  //                 childViewInputStructDev.childViewInputStructDev,
  //                 childObjectViewStruct.generateFunctionAppState,
  //               ));
  //           }
  //         } else {
  //           // <------------------------------------------------------------------------------------> //
  //           // without child views

  //           // generate functionAppStates
  //           let allMembers = { allMembersToAdd: [] };
  //           childObjectViewStruct.functionAppStates[objectID] = {};
  //           this.addAllChildIDRecursiveWithinFunctionAndReturnTrueIfHasWithinFunction(objectID, allMembers);
  //           allMembers.allMembersToAdd.forEach(dID => {
  //             this.functionFilteredIDs.filter(functionFilteredID => this.enumQuery.getEntity(functionFilteredID).common.members.some(e => e.startsWith(dID)))
  //               .forEach(fID => {
  //                 this.enumQuery.getEntity(fID).common.members.filter(e => e.startsWith(dID)).forEach(stateID => {
  //                   if (!(fID in childObjectViewStruct.functionAppStates[objectID])) {
  //                     childObjectViewStruct.functionAppStates[objectID][fID] = [];
  //                   }
  //                   childObjectViewStruct.functionAppStates[objectID][fID].push(stateID);
  //                 })
  //               })

  //           });
  //           Object.values(childObjectViewStruct.functionAppStates[objectID]).forEach(e => e = [...new Set(e)]);
  //           parentGenerateFunctionAppState(childObjectViewStruct.functionAppStates);
  //         }
  //       });
  //     } else if (this.objectQuery.hasEntity(objectID)) {
  //       // <------------------------------------------------------------------------------------> //
  //       // if it is an object object (sublevel of select all where members are Devices)
  //       this.objectQuery.selectEntity(objectID, entity => { return { id: entity._id, name: entity.common.name } }).subscribe(idName => {
  //         childObjectViewStruct.objectID = idName.id;
  //         childObjectViewStruct.name = idName.name;
  //         // generate functionAppStates
  //         childObjectViewStruct.functionAppStates[objectID] = {};
  //         this.functionFilteredIDs.filter(functionFilteredID => this.enumQuery.getEntity(functionFilteredID).common.members.includes(objectID))
  //           .forEach(fID => {
  //             console.log('hallo')
  //             if (!(fID in childObjectViewStruct.functionAppStates[objectID])) {
  //               childObjectViewStruct.functionAppStates[objectID][fID] = [];
  //             }
  //             childObjectViewStruct.functionAppStates[objectID][fID].push(objectID)
  //           });
  //         Object.values(childObjectViewStruct.functionAppStates[objectID]).forEach(e => e = [...new Set(e)]);
  //         parentGenerateFunctionAppState(childObjectViewStruct.functionAppStates);
  //       });
  //     }
  //   });
  //   // console.log(childViewInputStructDev)
  //   // console.log(childObjectViewStruct)
  //   return childObjectViewStruct;
  // }

  generateChildIObjectViewStruct(
    objectViewStruct: IObjectViewStruct,
    ojectViewInputStructDev: IOjectViewInputStructDev
  ) {
    console.log(ojectViewInputStructDev)
    // <------------------------------------------------------------------------------------> //
    // if there are children defined, generate them
    if ('childViewInputStructDev' in ojectViewInputStructDev) {
      //create children
      this.generateChildren(objectViewStruct, ojectViewInputStructDev);
    }
    // <------------------------------------------------------------------------------------> //
    // if no children generate the states...
    else {
      // generate functionAppStates
      this.generateFunctionAppStates(objectViewStruct);
    }
  }

  generateChildren(objectViewStruct: IObjectViewStruct, ojectViewInputStructDev: IOjectViewInputStructDev) {
    this.selectChildrenObjectList(ojectViewInputStructDev.childViewInputStructDev).subscribe((subOjectIDs: string[]) => {
      objectViewStruct.children = [];
      subOjectIDs.forEach((subObjectID: string) => {
        // get Object/Enum - Object
        let $tmpObjectIDName;
        if (this.enumQuery.hasEntity(subObjectID)) {
          $tmpObjectIDName = this.enumQuery.selectEntity(subObjectID, entity => { return { id: entity.id, name: entity.common.name } })
        }
        else if (this.objectQuery.hasEntity(subObjectID)) {
          $tmpObjectIDName = this.objectQuery.selectEntity(subObjectID, entity => { return { id: entity.id, name: entity.common.name } })
        }
        // generate child
        $tmpObjectIDName.subscribe(idName => {
          let tmpChild = {
            objectID: idName.id,
            name: idName.name,
            functionAppStates: {},
            // create generateFunctionAppState
            generateFunctionAppState: (functionAppStates: AppStatesModel) => {
              this.ngZone.run(() => {
                Object.keys(functionAppStates).forEach(key => {
                  objectViewStruct.functionAppStates[key] = functionAppStates[key];
                });
                objectViewStruct.generateFunctionAppState(objectViewStruct.functionAppStates);
              });
            },
          };

          this.generateChildIObjectViewStruct(tmpChild, ojectViewInputStructDev.childViewInputStructDev);
          objectViewStruct.children.push(tmpChild);
        })
      })
    });
  }

  generateFunctionAppStates(objectViewStruct: IObjectViewStruct) {
    // get all functionAppStates from members of objectID (enum/object Objects) and all his sub enums if any (select)
    console.log(this.getMembersObserver(objectViewStruct.objectID))
    this.selectAllDevicesWithinSubEnums(objectViewStruct.objectID).subscribe((sObjectIDs: string[]) => {
      console.log(sObjectIDs)
      objectViewStruct.functionAppStates = {}
      sObjectIDs.forEach(sObjectID => {
        let functionID = this.getFunctionPerDeviceID(sObjectID);
        if (!(sObjectID in objectViewStruct.functionAppStates)) {
          objectViewStruct.functionAppStates[sObjectID] = {};
        }
        if (!(functionID in objectViewStruct.functionAppStates[sObjectID])) {
          objectViewStruct.functionAppStates[sObjectID][functionID] = [];
        }
        objectViewStruct.functionAppStates[sObjectID][functionID].push(sObjectID);
      });
      objectViewStruct.generateFunctionAppState(objectViewStruct.functionAppStates);
    })
  }

  selectChildrenObjectList(objectViewInputStructDev: IOjectViewInputStructDev): Observable<string[]> {
    // objectViewInputStructDev.objectID == 'all' 
    //       ==> All Devices within this objectID and all sub enums devices

    // objectViewInputStructDev.subObjectFilteredID.length === 0 
    //       ==> all enums starting with objectID + '.' (only enums, devices will be ignored...)

    // objectViewInputStructDev.subObjectFilteredID.length >== 0
    //       ==> all id's within subObjectFilteredID (only enums, devices will be ignored...)

    return null;
  }

  getFunctionPerDeviceID(deviceID): string {
    Object.values(this.allIDsInTheFilteredFunctions).filter(entity => console.log(entity));
    return null;
  }

  getAllStatesWithinFunctionAndDevice(deviceID): string[] {
    return Object.values(this.allIDsInTheFilteredFunctions).reduce((acc, curr) => acc.concat(curr.members), []).filter(e => e.startsWith(deviceID));
  }

  selectAllDevicesWithinSubEnums(objectID: string): Observable<string[]> {
    // also check if in this.allIDsInTheFilteredFunctions
    let objectIDLevel = (objectID.match(/\./g) || []).length;
    if (objectIDLevel === 1 && this.enumQuery.hasEntity(objectID)) {
      let $members1 = this.enumQuery.selectAll(({ filterBy: entity => entity.id.startsWith(objectID + '.') }))
        .pipe(map(enums => {
          let members = enums.reduce((acc, curr) => acc.concat(curr.common.members), []);
          return members.filter(e => !e.startsWith('enum.')).map(e => this.getAllStatesWithinFunctionAndDevice(e)).flat(10);
        }));
      let $members2 = this.enumQuery.selectAll(({ filterBy: entity => entity.id.startsWith(objectID + '.') }))
        .pipe(map(enums => {
          let members = enums.reduce((acc, curr) => acc.concat(curr.common.members), []);
          return members.filter(e => e.startsWith('enum.')).map(e => this.selectAllDevicesWithinSubEnums(e))
        }),
          concatAll(),
          concatAll()
        );
      return merge($members1, $members2);
    }
    else if (objectIDLevel > 1 && this.enumQuery.hasEntity(objectID)) {
      let $members1 = this.enumQuery.selectEntity(objectID, entity => entity.common.members).pipe(map(enumIDS => {
        return enumIDS.filter(e => !e.startsWith('enum.')).map(e => this.getAllStatesWithinFunctionAndDevice(e)).flat(10);
      }));
      let $members2 = this.enumQuery.selectEntity(objectID, entity => entity.common.members).pipe(
        map(enumIDS => {
          return enumIDS.map(e => this.selectAllDevicesWithinSubEnums(e));
        }),
        concatAll(),
        concatAll()
      );
      return merge($members1, $members2);
    }
    else if (this.objectQuery.hasEntity(objectID)) {
      return of(this.getAllStatesWithinFunctionAndDevice(objectID));
    }
    return of([]);
  }

  getMembersObserver(id): string[] {
    // console.log(id)
    if (!this.enumQuery.hasEntity(id)) {
      return [];
    }
    let tt = [];
    tt.push(id);
    let objectIDLevel = (id.match(/\./g) || []).length;
    if (objectIDLevel === 1) {
      this.enumQuery.getAll(({ filterBy: entity => entity.id.startsWith(id + '.') }))
        .forEach(e => {
          e.common.members.forEach(a => {
            tt = tt.concat(this.getMembersObserver(a));
          })
        });
    } else {
      this.enumQuery.getEntity(id).common.members.forEach(e => {
        tt = tt.concat(this.getMembersObserver(e));
      });
    }
    return tt;

  }

  addAllChildIDRecursiveWithinFunctionAndReturnTrueIfHasWithinFunction(parentID, allMembers: { allMembersToAdd: string[] }) {
    let hasIn: boolean[] = [];
    this.enumQuery.getEntity(parentID).common.members.filter(e => e.startsWith('enum.')).forEach(id => {
      if (this.addAllChildIDRecursiveWithinFunctionAndReturnTrueIfHasWithinFunction(id, allMembers)) {
        allMembers.allMembersToAdd.push(id);
        hasIn.push(true);
      }
    })
    let deviceIDs = this.enumQuery.getEntity(parentID).common.members.filter(e => !e.startsWith('enum.'))
      .filter(id => this.allIDsInTheFilteredFunctions.some(e => e.startsWith(id)));
    if (deviceIDs.length > 0) {
      allMembers.allMembersToAdd = allMembers.allMembersToAdd.concat(deviceIDs);
      hasIn.push(true);
    }
    return hasIn.some(e => e);
  }

  // ===> end ----------------------------------------------------------------------------------------------------------- <=== //


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
        this.objectViewInputDev = detail.data;
        this.loadObjectStruct();
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
        valueSelectionFilters: ["enum.functions.light","enum.functions.rain"],
      }
    });
    modal.onDidDismiss().then((detail) => {
      this.ngZone.run(() => {
        console.log(detail)
        this.objectViewInputDev = detail.data.inputLevelObject;
        this.loadObjectStruct();
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
        "id": "enum.rooms",
        "subLevelFilters": [],
        "subLevel": {
          "id": "states",
          "subLevelFilters": []
        }
      }
    }
  `

}
