import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomService {
  generateRandomBytes(length: number): Uint8Array {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array); // Fill array with random values
    return array;
  }

  // Optional: Convert to hex string if needed
  generateRandomHexString(length: number): string {
    const bytes = this.generateRandomBytes(length);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}