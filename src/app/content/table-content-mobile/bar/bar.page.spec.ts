import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarPage } from './bar.page';

describe('BarPage', () => {
  let component: BarPage;
  let fixture: ComponentFixture<BarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
