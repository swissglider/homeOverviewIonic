import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageService } from '../../service/page.service';
import { ILevelStruct } from '../../service/level.service/level.struct.model';
import { LevelStructService } from '../../service/level.service/level.struct.service';
import { Observable } from 'rxjs';
import { ViewToShow } from '../../modules/states_view/app.views/app.views.model';
import { MenuModel } from '../../modules/menu/menu.model';

@Component({
    selector: 'app-overview-lights',
    templateUrl: 'overview.lights.page.html',
    styleUrls: ['overview.lights.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewLightsPage implements OnInit {

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
    // public valueSelectionFilters = ["enum.functions.light", "enum.functions.doors", "enum.functions.hum", "enum.functions.window", "enum.functions.batterie", "enum.functions.low_batterie"];
    public valueSelectionFilters = ["enum.functions.light"];

    public title: string | object = {en:"Lights", de:"Lichter"};
    public viewToShow = ViewToShow;
    public menu: MenuModel;

    public levelStruct$: Observable<ILevelStruct>;

    ngOnInit(): void {
        this.menu = this.pageService.getActiveMenuModel();
        this.levelStruct$ = this.levelStructService.transformLevelObjectToLevelStruct(
            this.inputLevelObject,
            this.valueSelectionID,
            this.valueSelectionFilters,
        );
    }

    constructor(
        public pageService: PageService,
        public levelStructService: LevelStructService,
    ) { }
}