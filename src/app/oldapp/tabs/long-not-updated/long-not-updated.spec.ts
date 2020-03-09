import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LongNotUpdated } from './long-not-updated';

describe('LongNotUpdated', () => {
  let component: LongNotUpdated;
  let fixture: ComponentFixture<LongNotUpdated>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LongNotUpdated],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LongNotUpdated);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
