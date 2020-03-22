import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { TestTab } from '../test.tab/test.tab'
import { ActivatedRoute } from '@angular/router';
import { IonTabs} from '@ionic/angular';

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
    elementRef: any;

    constructor(
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.tabs = this.route.snapshot.data['components'].filter(e => e.data.asTab).sort((a, b) => a.data['order'] - b.data['order']);   
    }

    ngAfterViewInit() {
        let routPath = ('_subPath' in this.route.snapshot.routeConfig) 
            ? this.route.snapshot.routeConfig['_subPath']
            : this.route.snapshot.routeConfig.data['defaultPath'];
        if(this.tabs_ !== null && this.tabs_ !== undefined){
            try{
                this.tabs_.select(routPath);
            } catch(e){
                this.tabs_.select(this.route.snapshot.routeConfig.data['defaultPath'])
            }
        }
    }

    getSelectedTab(): void {
        if(this.tabs_ !== null && this.tabs_ !== undefined){
            this.activeTabName = this.tabs_.getSelected();
        }
    }
}