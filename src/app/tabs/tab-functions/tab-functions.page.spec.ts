import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabFunctionsPage } from './tab-functions.page';

describe('TabFunctionsPage', () => {
  let component: TabFunctionsPage;
  let fixture: ComponentFixture<TabFunctionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabFunctionsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabFunctionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
