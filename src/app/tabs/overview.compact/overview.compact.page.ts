import { OnInit, Component, NgZone } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { ILevelStruct, IElementState } from '../../service/level.service/level.struct.model';
import { LevelStructService } from '../../service/level.service/level.struct.service';
import { Observable, Subscription } from 'rxjs';
import { IOBrokerService } from 'src/app/service/io-broker.service';
import { HelperService } from 'src/app/service/helper.service';
import { IoBStateQuery } from 'src/app/store/state/io-bstate.query';
import { ViewToShow } from 'src/app/modules/states_view/app.views/app.views.model';

@Component({
    selector: 'app-overview-compact',
    templateUrl: 'overview.compact.page.html',
    styleUrls: ['overview.compact.page.scss']
})
export class OverviewCompactPage implements OnInit {

    public viewToShow = ViewToShow;
    public selectedMember: ILevelStruct = null;

    public html_boolean_panel_functions_title: string[] = [
        'enum.functions.light',
        'enum.functions.doors',
        'enum.functions.window',
        'enum.functions.motion',
    ]

    public html_number_panel_functions_title: string[] = [
        'enum.functions.pressure',]

    public html_boolean_panel_functions: string[] = [
        'enum.functions.light',
        'enum.functions.doors',
        'enum.functions.window',
        'enum.functions.motion',
    ]

    public subFunctionNumbers: string[] = [
        'enum.functions.temp',
        'enum.functions.hum',
    ]

    public simpleValues: string[] = [
        'enum.functions.temp',
        'enum.functions.hum',
    ]

    private inputLevelObject = JSON.parse(
        `
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
    );
    public valueSelectionID = 'enum.functions';
    // public valueSelectionFilters = ["enum.functions.batterie", "enum.functions.button", "enum.functions.hum", "enum.functions.temp", "enum.functions.pressure", "enum.functions.low_batterie", "enum.functions.light", "enum.functions.window", "enum.functions.rain", "enum.functions.wind_", "enum.functions.doors", "enum.functions.motion"];
    public valueSelectionFilters = ["enum.functions.batterie", "enum.functions.hum", "enum.functions.temp", "enum.functions.pressure", "enum.functions.low_batterie", "enum.functions.light", "enum.functions.window", "enum.functions.wind_", "enum.functions.doors", "enum.functions.motion"];
    public levelStruct: ILevelStruct;
    public values: { id?: string, value?: number | string | boolean, subscription: Subscription }[] = [];
    loaded = false;

    constructor(
        public pageService: PageService,
        public levelStructService: LevelStructService,
        private ioBrokerService: IOBrokerService,
        public helperService: HelperService,
        public stateQuery: IoBStateQuery,
        private ngZone: NgZone,
    ) { }

    /** @ignore */
    ngOnInit(): void {
    }

    ionViewDidEnter() {
    }

    ionViewWillEnter() {
        this.init();
    }

    private init() {
        this.ioBrokerService.selectLoaded().subscribe(e => {
            if (e === false) { }
            if (e === true) {
                let temp: Observable<ILevelStruct> = this.levelStructService.transformLevelObjectToLevelStruct(
                    this.inputLevelObject,
                    this.valueSelectionID,
                    this.valueSelectionFilters,
                )
                temp.subscribe((e: ILevelStruct) => {
                    this.ngZone.run(() => {
                        this.levelStruct = e;
                        this.loaded = true;
                        this.selectedMember = this.levelStruct.getMembers()[0]
                        // console.log(this.levelStruct);
                    });
                });
            }
        });
    }

    segmentChanged(ev: any) {
        this.selectedMember = ev.detail.value;
    }
}