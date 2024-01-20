import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductIngredientPage } from './product-ingredient.page';

describe('ProductIngredientPage', () => {
  let component: ProductIngredientPage;
  let fixture: ComponentFixture<ProductIngredientPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductIngredientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
