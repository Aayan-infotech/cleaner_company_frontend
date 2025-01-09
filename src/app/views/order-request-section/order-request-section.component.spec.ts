import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestSectionComponent } from './order-request-section.component';

describe('OrderRequestSectionComponent', () => {
  let component: OrderRequestSectionComponent;
  let fixture: ComponentFixture<OrderRequestSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRequestSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderRequestSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
