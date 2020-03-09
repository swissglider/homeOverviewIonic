import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WrongEnumEntry } from './wrong-enums-entry';

describe('WrongEnumEntry', () => {
  let component: WrongEnumEntry;
  let fixture: ComponentFixture<WrongEnumEntry>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WrongEnumEntry],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WrongEnumEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
