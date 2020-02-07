import { Component, Input, OnInit, NgZone, Output, EventEmitter } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { AppStatesModel } from './app.states.model';
import { IoBStateQuery } from 'src/app/store/state/io-bstate.query';
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { HelperService } from 'src/app/service/helper.service';
import { IconsService } from 'src/app/service/icons.service';
import { IoBEnum } from 'src/app/store/enum/io-benum.model';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';

@Component({
  selector: 'app-states-component',
  templateUrl: 'app.states.component.html',
  styleUrls: ['app.states.component.scss']
})
export class AppStatesComponent implements OnInit {

  @Input() appStates?: AppStatesModel[];
  @Input() view?: string;
  @Input() autoswitch?: boolean;
  @Input() name?: string | object;
  @Input() onlyWithStates?: boolean;
  @Output() doSwitch = new EventEmitter<boolean>();
  @Output() doMenuToggle = new EventEmitter();

  value: any;
  functionID: string;
  writable: boolean;
  type: string;
  role: string;
  ids: Array<string> = [];
  hide = false;
  selection = 'standard';


  constructor(
    public pageService: PageService,
    private ngZone: NgZone,
    private stateQuery: IoBStateQuery,
    private objectQuery: IoBObjectQuery,
    public helperService: HelperService,
    public iconsService: IconsService,
    private enumQuery: IoBEnumQuery,
  ) { }

  /** @ignore */
  ngOnInit(): void {
    if (this.view === undefined) {
      this.view = 'default';
    }
    if (this.autoswitch === undefined) {
      this.autoswitch = true;
    }
    if (this.onlyWithStates === undefined) {
      this.onlyWithStates = true;
    }
    if (this.name === undefined) {
      this.name = '';
    }
    try {
      this.appStates.$containing_enum.subscribe((enu: IoBEnum) => {
      // this.appStates.$function_enum.subscribe((enu: IoBEnum) => {
        if (enu) {
          this.ngZone.run(() => {
            this.functionID = enu.id;
          });
        }
      });
    } catch (error) {
      console.log(this)
    }
    this.appStates.$state_ids.subscribe((ids: Array<string>) => {
      this.ngZone.run(() => {
        if (ids === null || ids === undefined) {
          return;
        }
        ids = ids.flat(10);
        if (ids.length < 1) {
          if (this.onlyWithStates) {
            this.hide = true;
          }
          return;
        }
        this.ids = ids;
        let tmpObject = this.objectQuery.getEntity(ids[0]);
        try{ this.writable = tmpObject.common.write}catch(e){ this.writable = false}
        try{ this.type = tmpObject.common.type}catch(e){ this.type = ''}
        try{ this.role = tmpObject.common.role}catch(e){ this.role = ''}
        let stateValues = this.stateQuery.selectMany(ids, entity => entity.val);
        stateValues.subscribe((values) => {
          this.ngZone.run(() => {
            switch (this.type) {
              case 'boolean':
                switch (this.functionID) {
                  case 'enum.functions.low_batterie':
                    this.value = values.some(value => !value);
                    this.selection = 'icon_boolean';
                    break;
                  default:
                    if(this.role.includes('switch') && this.writable){
                      this.value = values.some(value => value);
                      this.selection = 'icon_switch';
                      break;
                    }
                    this.value = values.some(value => value);
                    this.selection = 'icon_boolean';
                    break;
                }
                break;
              case 'number':
                switch (this.functionID) {
                  case 'enum.functions.batterie':
                    this.value = values.filter(e => e < 20).length > 0 ? false : true;
                    this.selection = 'icon_boolean';
                    break;
                  case 'enum.functions.button':
                    this.value = false;
                    this.selection = 'empty';
                    break;
                    case 'enum.functions.temp':
                      this.value = (values.map(e => Number(e)).reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                      this.value = String(this.value) + ' °C';
                      this.selection = 'number_avarage';
                      break;
                    case 'enum.functions.hum':
                      this.value = (values.map(e => Number(e)).reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                      this.value = String(this.value) + ' %';
                      this.selection = 'number_avarage';
                      break;
                    case 'enum.functions.pressure':
                      this.value = (values.map(e => Number(e)).reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                      this.value = String(this.value) + ' hPa';
                      this.selection = 'number_avarage';
                      break;
                      case 'enum.functions.rain':
                        this.value = (values.map(e => Number(e)).reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                        this.value = String(this.value) + ' mm';
                        this.selection = 'number_avarage';
                        break;
                        case 'enum.functions.wind_':
                          this.value = (values.map(e => Number(e)).reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                          this.value = String(this.value) + ' km/h';
                          this.selection = 'number_avarage';
                          break;
                  default:
                    this.value = (values.map(e => Number(e)).reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                    this.selection = 'number_avarage';
                }
                break;
              default:
                this.value = (values.map(e => Number(e)).reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                this.selection = 'number_avarage';
            }

          });
        });
      });
    });
  }

  doSwitchFunc(state) {
    if (this.autoswitch) {
      this.helperService.functionToggle(this.ids, state);
    }
    this.doSwitch.emit(state);
  }

  doMenuToggleFunc() {
    this.doMenuToggle.emit();
  }

  getIconValue(): string{
    return this.iconsService.getIcon(this.functionID.substring(this.functionID.lastIndexOf('.')+1), 'blue-ui-' + this.value, '20');
  }

  getIcon(): string{
    return this.iconsService.getIcon(this.functionID.substring(this.functionID.lastIndexOf('.')+1), 'blue-ui', '20');
  }

}