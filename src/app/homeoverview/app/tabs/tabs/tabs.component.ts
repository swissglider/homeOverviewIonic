import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { TestTab } from '../test.tab/test.tab'
import { ActivatedRoute } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { TestService } from '../../services/test.service/test.service';

@Component({
    selector: 'tabs-component',
    templateUrl: 'tabs.component.html',
    styleUrls: ['tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements OnInit, AfterViewInit {

    @ViewChild('tabs_', { static: true }) tabs_: IonTabs;

    testTab = TestTab;
    tabs: Array<any>;
    activeTabName: string;

    trackByPath = (index: number, item: any) => item.path;

    constructor(
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        // console.log(this.route.snapshot.data)
        this.tabs = this.route.snapshot.data['components'].filter(e => e.data.asTab).sort((a, b) => a.data['order'] - b.data['order']);
    }

    ngAfterViewInit() {
        this.tabs_.select('testtab');
    }

    getSelectedTab(): void {
        this.activeTabName = this.tabs_.getSelected();
    }
}