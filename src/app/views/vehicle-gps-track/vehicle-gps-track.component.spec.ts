import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleGpsTrackComponent } from './vehicle-gps-track.component';

describe('VehicleGpsTrackComponent', () => {
  let component: VehicleGpsTrackComponent;
  let fixture: ComponentFixture<VehicleGpsTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleGpsTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleGpsTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
