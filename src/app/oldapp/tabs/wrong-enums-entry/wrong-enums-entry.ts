import { Component, NgZone } from '@angular/core';
import { IOBrokerService } from '../../service/io-broker.service';
import { IoBEnumQuery } from '../../store/enum/io-benum.query';
import { IoBEnum } from '../../store/enum/io-benum.model';
import { IoBObjectQuery } from '../../store/object/io-bobject.query';
import { HelperService } from '../../service/helper.service';
import { EntityActions } from '@datorama/akita';
import { PageService } from '../../service/page.service';


interface EnumGroupStruct {
  enumGroupID: string;
  name?: string | object;
  enums?: {};
  counterWrongMembersEntry?: number;
  expanded?: boolean,
}

interface EnumStruct {
  enumID: string;
  name?: string | object;
  entries?: Array<String>;
  counterWrongMembersEntry?: number;
  expanded?: boolean,
}

@Component({
  selector: 'app-wrong-enums-entry',
  templateUrl: 'wrong-enums-entry.html',
  styleUrls: ['wrong-enums-entry.scss']
})
export class WrongEnumEntry {

  public groups = {};
  loaded: boolean;
  templateToShow: string;

  constructor(
    private ioBrokerService: IOBrokerService,
    private ngZone: NgZone,
    private enumQuery: IoBEnumQuery,
    private objectQuery: IoBObjectQuery,
    public helperService: HelperService,
    public pageService:PageService,
  ) { }

  /** @ignore */
  ionViewWillEnter(): void {
    this.ioBrokerService.selectLoaded().subscribe(e => {
      this.ngZone.run(() => {
        this.loaded = e;
        this.templateToShow = (this.loaded) ? 'loaded' : 'notLoaded'
      });
      if (e === true) {
        this.enumQuery.selectEnumsID().subscribe(addedIds => {
          this.initEnumGroupStruct();
        });
        this.initEnumGroupStruct();
      }
    });
  }

  private initEnumGroupStruct(){
    const enums: IoBEnum[] = this.enumQuery.getAll()
    if (!enums) {
      return;
    }
    this.ngZone.run(() => {
      this.groups = {};
      enums.forEach((enuO: IoBEnum) => {
        if ((enuO.id.split(".").length - 1) > 1 && 'common' in enuO && 'members' in enuO.common) {
          const enumGroupID = enuO.id.substr(0, enuO.id.lastIndexOf('.'));
          if (!(enumGroupID in this.groups)) {
            this.groups[enumGroupID] = <EnumGroupStruct>{
              enumGroupID: enumGroupID,
              enums: {},
              counterWrongMembersEntry: 0,
              expanded: false,
            };
            this.enumQuery.selectNameByID(enumGroupID).subscribe(name => this.ngZone.run(() => { this.groups[enumGroupID].name = name }));
          }
          if (!(enuO.id in this.groups[enumGroupID].enums)) {
            let tmpEnumStruct: EnumStruct = {
              enumID: enuO.id,
              entries: [],
              counterWrongMembersEntry: 0,
              expanded: false,
            };
            this.groups[enumGroupID].enums[enuO.id] = tmpEnumStruct;
            this.enumQuery.selectNameByID(enuO.id).subscribe(name => this.ngZone.run(() => { this.groups[enumGroupID].enums[enuO.id].name = name }));
          }
          this.enumQuery.getAllMembersPerEnumID(enuO.id).subscribe((members:string[]) => {
            this.ngZone.run(() => {
              this.groups[enumGroupID].enums[enuO.id].entries = [];
              members.forEach(id => {
                if (!id.startsWith('enum.') && !this.objectQuery.hasEntity(id)) {
                  this.groups[enumGroupID].enums[enuO.id].entries.push(id);
                }
              });
              this.setCounter();
            });
          });
        }
      });
    });
  }

  private setCounter(){
    Object.values(this.groups).forEach((group: EnumGroupStruct) => {
      group.counterWrongMembersEntry = 0;
      Object.values(group.enums).forEach((enums: EnumStruct) => {
        this.ngZone.run(() => {
          enums.counterWrongMembersEntry = enums.entries.length;
          group.counterWrongMembersEntry = group.counterWrongMembersEntry + enums.counterWrongMembersEntry;
        });
      });
    });
  }

  removeEnumMember(enumID, idsToDelete){
    if(this.enumQuery.hasEntity(enumID)){
      let enumToChange = JSON.parse(JSON.stringify(this.enumQuery.getEntity(enumID)));
      enumToChange.common.members = enumToChange.common.members.filter(e => !idsToDelete.includes(e));
      this.ioBrokerService.setObject(enumID, enumToChange);
    }
  }

  removeAllEnumMebersFromEnumStruct(enumGroupID, enumID){
    this.removeEnumMember(enumID, this.groups[enumGroupID].enums[enumID].entries);
  }

  removeAllEnumMembersFromEnumGroupStruct(enumGroupID){
    Object.values(this.groups[enumGroupID].enums).forEach((eS: EnumStruct) => {
      this.removeEnumMember(eS.enumID, this.groups[enumGroupID].enums[eS.enumID].entries);
    });
  }

  removeAllEnumMembersFromGroup(){
    Object.values(this.groups).forEach((enumGroup: EnumGroupStruct) => {
      this.removeAllEnumMembersFromEnumGroupStruct(enumGroup.enumGroupID);
    });
  }

  getTotalCount(): number {
    let counter = 0
    Object.values(this.groups).forEach((enumGroup: EnumGroupStruct) => {
      counter = counter + enumGroup.counterWrongMembersEntry;
    });
    return counter;
  }
}
