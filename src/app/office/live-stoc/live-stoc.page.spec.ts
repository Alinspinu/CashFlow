import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveStocPage } from './live-stoc.page';

describe('LiveStocPage', () => {
  let component: LiveStocPage;
  let fixture: ComponentFixture<LiveStocPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LiveStocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
