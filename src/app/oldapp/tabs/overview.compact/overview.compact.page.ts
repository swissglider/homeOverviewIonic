import { OnInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { PageService } from '../../service/page.service';
import { ILevelStruct } from '../../service/level.service/level.struct.model';
import { LevelStructService } from '../../service/level.service/level.struct.service';
import { Observable } from 'rxjs';
import { HelperService } from '../../service/helper.service';
import { ViewToShow } from '../../modules/states_view/app.views/app.views.model';

@Component({
    selector: 'app-overview-compact',
    templateUrl: 'overview.compact.page.html',
    styleUrls: ['overview.compact.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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

    public menu = this.pageService.getActiveMenuModel();
    public levelStruct$: Observable<ILevelStruct>;

    constructor(
        public pageService: PageService,
        public levelStructService: LevelStructService,
        public helperService: HelperService,
    ) { }

    /** @ignore */
    ngOnInit(): void {
        this.menu = this.pageService.getActiveMenuModel();
        this.levelStruct$ = this.levelStructService.transformLevelObjectToLevelStruct(
            this.inputLevelObject,
            this.valueSelectionID,
            this.valueSelectionFilters,
        );
    }

    segmentChanged(ev: any) {
        this.selectedMember = ev.detail.value;
    }

    getSelectedSegment(is: ILevelStruct): ILevelStruct {
        return (this.selectedMember) ? this.selectedMember : is.getMembers()[0];
    }
}