import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignThemesComponent } from './design-themes.component';

describe('DesignThemesComponent', () => {
  let component: DesignThemesComponent;
  let fixture: ComponentFixture<DesignThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignThemesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
