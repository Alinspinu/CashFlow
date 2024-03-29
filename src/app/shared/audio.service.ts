import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;

  constructor() {
    this.audio = new Audio();
    this.audio.src = 'assets/audio/ding.mp3'; // Adjust the path to your sound file
    this.audio.addEventListener('ended', () => {
      if (this.isPlaying) {
        this.audio.play();
      }
    });
  }

  play() {
    if (!this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  stop() {
    this.audio.pause();
    this.isPlaying = false;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

