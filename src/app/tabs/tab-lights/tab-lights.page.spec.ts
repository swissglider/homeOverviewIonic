import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabLightsPage } from './tab-lights.page';

describe('TabLightsPage', () => {
  let component: TabLightsPage;
  let fixture: ComponentFixture<TabLightsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabLightsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabLightsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
