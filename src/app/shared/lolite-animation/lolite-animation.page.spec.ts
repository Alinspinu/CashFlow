import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoliteAnimationPage } from './lolite-animation.page';

describe('LoliteAnimationPage', () => {
  let component: LoliteAnimationPage;
  let fixture: ComponentFixture<LoliteAnimationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoliteAnimationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
