import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTab } from '../tabs/test.tab/test.tab'
import { TestTab1 } from '../tabs/test1.tab/test.tab'
import { TestTab2 } from '../tabs/test2.tab/test.tab'
import { TestTab3 } from '../tabs/test3.tab/test.tab'
import { RouterModule } from '@angular/router';
import { MenuModule } from '../components/menu/menu.module';
import { PipeModule } from '../../_global/pipes/pipes.module';
import { ErrorLoggerComponent } from './error.logger.tab/error.logger.tab';
import { ErrorLoggerModal } from './error.logger.tab/error.logger.modal/error.logger.modal';
import { ErrorLoggerPopoverComponent } from './error.logger.tab/popover/error.logger.popover.component';
import { TwoLevelTabComponent } from './two.level.tab/two-level-tab.component';
import { AppStatesViewModule } from '../components/states_view/app.states.view.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        MenuModule,
        PipeModule,
        RouterModule.forChild([{ path: '', component: TestTab }]),
    ],
    declarations: [
        TestTab,
    ],
})
export class TestTabModule { }

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        MenuModule,
        PipeModule,
        RouterModule.forChild([{ path: '', component: TestTab1 }]),
    ],
    declarations: [
        TestTab1,
    ],
})
export class TestTabModule1 { }

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        MenuModule,
        PipeModule,
        RouterModule.forChild([{ path: '', component: TestTab2 }]),
    ],
    declarations: [
        TestTab2,
    ],
})
export class TestTabModule2 { }

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        MenuModule,
        PipeModule,
        RouterModule.forChild([{ path: '', component: TestTab3 }]),
    ],
    declarations: [
        TestTab3,
    ],
})
export class TestTabModule3 { }

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        MenuModule,
        PipeModule,
        RouterModule.forChild([{ path: '', component: ErrorLoggerComponent }]),
    ],
    declarations: [
        ErrorLoggerComponent,
        ErrorLoggerModal,
        ErrorLoggerPopoverComponent,
    ],
    entryComponents: [
        ErrorLoggerModal,
        ErrorLoggerPopoverComponent,
    ],
})
export class ErrorLoggerModule { }

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        MenuModule,
        PipeModule,
        AppStatesViewModule,
        RouterModule.forChild([{ path: '', component: TwoLevelTabComponent }]),
    ],
    declarations: [
        TwoLevelTabComponent,
    ],
    entryComponents: [],
})
export class TwoLevelTabModule { }

export const modules = {
    'TestTabModule': TestTabModule,
    'TestTabModule1': TestTabModule1,
    'TestTabModule2': TestTabModule2,
    'TestTabModule3': TestTabModule3,
    'ErrorLoggerModule': ErrorLoggerModule,
    'TwoLevelTabModule': TwoLevelTabModule,
};