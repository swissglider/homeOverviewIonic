import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { TestTab } from '../test.tab/test.tab'
import { ActivatedRoute } from '@angular/router';
import { ComponentModel } from '../../services/model/menu.model';
import { IonTabs } from '@ionic/angular';

@Component({
    selector: 'tabs-component',
    templateUrl: 'tabs.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements OnInit, AfterViewInit {

    @ViewChild('tabs_',{static:false}) tabs_: IonTabs;

    testTab = TestTab;
    tabs: Array<ComponentModel>;

    trackByPath = (index: number, item: any) => item.path;

    constructor(
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.tabs = this.route.snapshot.data['model'].apps;
    }

    ngAfterViewInit() {
        this.tabs_.select('testtab');
    }
}