import { OnInit, Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ILevelStruct } from '../../../_global/services/level.service/level.struct.model';
import { LevelStructService } from '../../../_global/services/level.service/level.struct.service';
import { Observable, Subscription } from 'rxjs';
import { ViewToShow } from '../../components/states_view/app.views/app.views.model';
import { IOBrokerService } from '../../../_global/services/iobroker.service/iobroker.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { CONNECTION_STATUS } from 'src/app/homeoverview/_global/services/iobroker.service/iobroker.service.model';

@Component({
    selector: 'app-overview-compact',
    templateUrl: 'overview.compact.page.html',
    styleUrls: ['overview.compact.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewCompactPage implements OnInit, OnDestroy {

    public viewToShow = ViewToShow;
    public selectedMember: ILevelStruct = null;

    trackById = (index: number, item: any) => item.id;

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

    public levelStruct$: Observable<ILevelStruct>;
    private subscription: Subscription[] = [];

    constructor(
        private levelStructService: LevelStructService,
        private ioBrokerService: IOBrokerService,
        private ref: ChangeDetectorRef,
    ) { }

    /** @ignore */
    ngOnInit(): void {}

    ionViewWillEnter() {
        this.subscription.push(this.ioBrokerService.connectionState$.pipe(distinctUntilChanged()).subscribe(e => {
            if (e === CONNECTION_STATUS.connected) {
                let time1 = new Date().getTime()
                this.levelStruct$ = this.levelStructService.transformLevelObjectToLevelStruct(
                    this.inputLevelObject,
                    this.valueSelectionID,
                    this.valueSelectionFilters,
                );
                this.ref.markForCheck();
                let time2 = new Date().getTime()
                console.log('In: ' + '/app/overview', (time2 - time1));
            }
        }));
        let time1 = new Date().getTime()
        this.levelStruct$ = this.levelStructService.transformLevelObjectToLevelStruct(
            this.inputLevelObject,
            this.valueSelectionID,
            this.valueSelectionFilters,
        );
        this.ref.markForCheck();
        let time2 = new Date().getTime()
        console.log('Out: ' + '/app/overview', (time2 - time1));
    }

    segmentChanged(ev: any) {
        this.selectedMember = ev.detail.value;
    }

    getSelectedSegment(is: ILevelStruct): ILevelStruct {
        return (this.selectedMember) ? this.selectedMember : is.getMembers()[0];
    }

    ngOnDestroy() {
        console.log('/app/overview', 'ngOnDestroy');
        this.subscription.forEach(e => {
            e.unsubscribe()
        })
    }

    ionViewDidLeave() {
        this.subscription.forEach(e => {
            e.unsubscribe()
        })
        console.log('/app/overview', 'ionViewDidLeave'); 
        this.levelStructService.destroyLS(
            this.inputLevelObject,
            this.valueSelectionID,
            this.valueSelectionFilters,
        )
    }
}