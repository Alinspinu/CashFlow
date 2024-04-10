import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WebRTCService } from '../webRTC.service';
import { Bill, BillProduct } from 'src/app/models/table.model';
import { round } from 'src/app/shared/utils/functions';
import {ContentService} from '../content.service';
import { take, tap } from 'rxjs';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { TipsPage } from './tips/tips.page';
import * as confetti from 'canvas-confetti';
import { MeniuPage } from './meniu/meniu.page';
import { BillPage } from './bill/bill.page';




@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.page.html',
  styleUrls: ['./user-display.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe, TipsPage, MeniuPage, BillPage]
})
export class UserDisplayPage implements OnInit, AfterViewInit {

  bill!: Bill
  hideBill: boolean = false

  @ViewChild('scrollableElement') content!: ElementRef;
  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private webRTC: WebRTCService,

  ) { }

  ngOnInit() {
    this.getBill()
    this.getInvite()
  }



  ngAfterViewInit(): void {

  }


  // celebrate() {
  //   confetti.create(this.confettiCanvas.nativeElement, { resize: true })({
  //     particleCount: 2000,
  //     spread: 600,
  //     colors: ['#d17b5f', '#dda170', '#ffa052', '#000'],
  //     origin: { x: 0.5, y: 0.7 },
  //     angle: 40,
  //     decay: 0.9,
  //     gravity: 1.5,
  //     scalar: 1.3,
  //     ticks: 600,
  //     shapes: ['square', 'circle', 'star'],
  //   });
  // }

  getBill(){
    this.webRTC.getProductAddedObservable().subscribe(response => {
      if(response){
        this.bill = JSON.parse(response)
      }
      })
  }


  getInvite(){
    console.log('hit the function')
    this.webRTC.getInviteToTip().subscribe(response => {
      console.log(response)
      if(response === 'invite'){
        this.hideBill = true
      } else {
        this.hideBill = false
      }
    })
  }



  reciveTipsValue(ev: any){
    console.log(ev)
    if(ev || ev === 0){
      this.hideBill = false
      this.webRTC.getUserTip(ev)
    }
  }

  modifyImageURL(url: string): string {
    const parts = url.split('/v1');
    const baseURL = parts[0];
    const cropParameters = '/w_555,h_555,c_fill';
    const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
    return cropUrl;
  }

  calcProductTotal(products: BillProduct[]){
    let total = 0
    products.forEach(el => {
        total += +el.total
    })
    return total
  }

  roundInHtml(num: number){
    return round(num)
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
