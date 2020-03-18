import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ViewToShow } from '../../components/states_view/app.views/app.views.model';
import { Observable } from 'rxjs';
import { ILevelStruct } from '../../../_global/services/level.service/level.struct.model';
import { LevelStructService } from '../../../_global/services/level.service/level.struct.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-two-level-tab',
  templateUrl: './two-level-tab.component.html',
  styleUrls: ['./two-level-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoLevelTabComponent implements OnInit {

  private inputLevelObject: {};
  public valueSelectionID: string;
  // public valueSelectionFilters = ["enum.functions.light", "enum.functions.doors", "enum.functions.hum", "enum.functions.window", "enum.functions.batterie", "enum.functions.low_batterie"];
  public valueSelectionFilters: string[];

  public viewToShow = ViewToShow;

  public levelStruct$: Observable<ILevelStruct>;
  public valueType: string;
  public htmlBoolPanels:string[];
  public htmlNumberPanels:string[];

  trackById = (index: number, item: any) => item.id;

  ngOnInit(): void {
    this.valueSelectionID = this.route.snapshot.data['valueSelectionID'];
    this.valueSelectionFilters = this.route.snapshot.data['valueSelectionFilters'];
    this.inputLevelObject = this.route.snapshot.data['inputLevelObject'];
    this.valueType = this.route.snapshot.data['valueType'];
    if(this.valueType === 'boolean'){ this.htmlBoolPanels = this.valueSelectionFilters; }
    if(this.valueType === 'number'){ this.htmlNumberPanels = this.valueSelectionFilters; }
    this.levelStruct$ = this.levelStructService.transformLevelObjectToLevelStruct(
      this.inputLevelObject,
      this.valueSelectionID,
      this.valueSelectionFilters,
    );
  }

  constructor(
    // public pageService: PageService,
    public levelStructService: LevelStructService,
    private route: ActivatedRoute,
  ) { }

  test(t){
    console.log(t)
    return 'Hallo'
}

}
