import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  private screenSizeSubject = new BehaviorSubject<string>(this.getScreenSize());
  screenSize$ = this.screenSizeSubject.asObservable();

  constructor(private ngZone: NgZone) {
    // Add an event listener for window resize
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize() {
    // Use NgZone to update the state
    this.ngZone.run(() => {
      this.screenSizeSubject.next(this.getScreenSize());
    });
  }

  private getScreenSize(): string {
    const width = window.innerWidth;
    if (width < 600) {
      return 'Phone'; // Mobile
    } else if (width < 960) {
      return 'Tablet';  // Tablet
    } else if (width < 1300) {
      return 'TabletWide';     // Desktop
    } else {
      return 'Web';
    }
  }

  // Cleanup to prevent memory leaks
  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }
}
