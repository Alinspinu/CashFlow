import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepViewPage } from './dep-view.page';

describe('DepViewPage', () => {
  let component: DepViewPage;
  let fixture: ComponentFixture<DepViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DepViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
