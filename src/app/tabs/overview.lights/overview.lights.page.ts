import { Component, NgZone, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { ILevelStruct } from '../../service/level.service/level.struct.model';
import { LevelStructService } from '../../service/level.service/level.struct.service';
import { Observable, Subscription } from 'rxjs';
import { IOBrokerService } from 'src/app/service/io-broker.service';
import { HelperService } from 'src/app/service/helper.service';
import { ViewToShow } from 'src/app/modules/states_view/app.views/app.views.model';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';

@Component({
    selector: 'app-overview-lights',
    templateUrl: 'overview.lights.page.html',
    styleUrls: ['overview.lights.page.scss'],
})
export class OverviewLightsPage implements OnInit, OnChanges, OnDestroy {

    private inputLevelObject = JSON.parse(
        `
            {
                "id": "enum.floor",
                "subLevelFilters": [],
                "subLevel": {
                "id": "states",
                "subLevelFilters": []
                }
            }
        `
    );
    public valueSelectionID = 'enum.functions';
    public valueSelectionFilters = ["enum.functions.light"];

    public title: string | object = '';
    public viewToShow = ViewToShow;
    public levelStruct: ILevelStruct;
    public values: { id?: string, value?: number | string | boolean, subscription: Subscription }[] = [];
    public loaded = false;
    public menu = this.pageService.getActiveMenuModel();

    ngOnChanges(changes) {
        // console.log('ngOnChanges')
    }

    ngOnInit(): void {
        // console.log('ngOnInit')
        this.init();
    }

    ngOnDestroy(){
        // console.log('ngOnDestroy')
    }

    ionViewWillEnter() {
        // console.log('ionViewWillEnter')
    }

    constructor(
        public pageService: PageService,
        public levelStructService: LevelStructService,
        private ioBrokerService: IOBrokerService,
        private enumQuery: IoBEnumQuery,
        public helperService: HelperService,
        private ngZone: NgZone,
    ) { }

    private init() {
        this.ioBrokerService.selectLoaded().subscribe(e => {
            if (e === false) { }
            if (e === true) {
                this.ngZone.run(() => {
                    this.title = this.enumQuery.getEntity(this.valueSelectionFilters[0]).common.name;
                });
                let temp: Observable<ILevelStruct> = this.levelStructService.transformLevelObjectToLevelStruct(
                    this.inputLevelObject,
                    this.valueSelectionID,
                    this.valueSelectionFilters,
                )
                temp.subscribe((e: ILevelStruct) => {
                    this.ngZone.run(() => {
                        this.levelStruct = e;
                        this.loaded = true;
                    });
                });
            }
        });
    }
}