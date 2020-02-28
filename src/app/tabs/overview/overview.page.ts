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
    selector: 'app-overview',
    templateUrl: 'overview.page.html',
    styleUrls: ['overview.page.scss']
})
export class OverviewPage implements OnInit {

    public viewToShow = ViewToShow.card_overview;

    public html_boolean_panel_functions: string[] = [
        'enum.functions.light',
        'enum.functions.doors',
        'enum.functions.window',
        'enum.functions.motion',
    ]

    public html_number_panel_functions: string[] = [
        'enum.functions.temp',
        'enum.functions.hum',
        // 'enum.functions.wind_',
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
    private valueSelectionID = 'enum.functions';
    private valueSelectionFilters = [];
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
    ) {}

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
                        // console.log(this.levelStruct);
                    });
                });
            }
        })
    }
}