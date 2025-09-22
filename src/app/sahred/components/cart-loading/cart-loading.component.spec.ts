import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartLoadingComponent } from './cart-loading.component';

describe('CartLoadingComponent', () => {
  let component: CartLoadingComponent;
  let fixture: ComponentFixture<CartLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
