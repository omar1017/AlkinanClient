import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMainComponent } from './supplier-main.component';

describe('SupplierMainComponent', () => {
  let component: SupplierMainComponent;
  let fixture: ComponentFixture<SupplierMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
