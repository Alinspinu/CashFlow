import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { round } from 'src/app/shared/utils/functions';
import * as confetti from 'canvas-confetti';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('2s ease', style({ opacity: 0.1 }))
      ])
    ])
  ]
})
export class TipsPage implements OnInit {

  @Input() total!: number
  @Output() tipsValue = new EventEmitter<number>();

  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;

  tipsVal: number = 0
  showConfeti: boolean = false
  isVisible: boolean = true
  options: any = [
    {
      precent: 0,
      img: 'assets/icon/0.svg'
    },
    {
      precent: 10,
      img: 'assets/icon/10.svg'
    },
    {
      precent: 15,
      img: 'assets/icon/15.svg'
    },
    {
      precent: 20,
      img: 'assets/icon/20.svg'
    }
  ]


  constructor() { }

  ngOnInit() {
    console.log('hit on it')
    console.log(this.isVisible)
    console.log(this.total)
  }

  sendTips(tipsProc: number) {
    this.showConfeti = true
    const valToEmit = tipsProc / 100 * this.total
    if(tipsProc === 0) {
      setTimeout(() => {
        this.celebrate(15, 200, 0.1, 0.8)
      }, 400)
    }
    if(tipsProc === 10) {
      setTimeout(() => {
        this.celebrate(300, 300, 0.3, 0.5)
      }, 400)
    }
    if(tipsProc === 15) {
      setTimeout(() => {
        this.celebrate(1100, 600, 0.5, 0.5)
      }, 400)
    }
    if(tipsProc === 20) {
      setTimeout(() => {
        this.celebrate(1000, 500, 0.6, 0.7)
        setTimeout(() => {
          this.celebrate(1000, 500, 0.2, 0.5)
          setTimeout(() => {
            this.celebrate(1000, 500, 0.6, 0.3)
          }, 300)
        }, 300)
      }, 400)
    }
    this.isVisible = false
    this.tipsVal = valToEmit
    this.tipsValue.emit(valToEmit);
  }



  celebrate(particleCount: number, spread: number, x: number, y: number) {
    confetti.create(this.confettiCanvas.nativeElement, { resize: true })({
      particleCount: particleCount,
      spread: spread,
      colors: ['#d17b5f', '#dda170', '#ffa052', '#000'],
      origin: { x: x, y: y },
      angle: 90,
      decay: 0.9,
      gravity: 1.3,
      scalar: 1.3,
      ticks: 600,
      shapes: ['square', 'circle', 'star'],
    });
    setTimeout(() => {
      this.showConfeti = false
    }, 3000)
  }


  roundInHtml(num: number){
    return round(num)
  }

}
