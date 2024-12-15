import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WebRTCService } from '../webRTC.service';
import { Bill} from 'src/app/models/table.model';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { TipsPage } from './tips/tips.page';

import { MeniuPage } from './meniu/meniu.page';
import { BillPage } from './bill/bill.page';




@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.page.html',
  styleUrls: ['./user-display.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe, TipsPage, MeniuPage, BillPage]
})
export class UserDisplayPage implements OnInit {

  bill!: Bill | null
  hideBill: boolean = false



  constructor(
    private webRTC: WebRTCService,

  ) { }

  ngOnInit() {
    this.getBill()
    this.getInvite()
  }

  getBill(){
    this.webRTC.getProductAddedObservable().subscribe(response => {
      if(response){
        this.bill = JSON.parse(response)
      }
      if(response === null){
        this.bill = null
      }
      })
  }


  getInvite(){
    this.webRTC.getInviteToTip().subscribe(response => {
      if(response === 'invite'){
        this.hideBill = true
      } else {
        this.hideBill = false
      }
    })
  }

  reciveTipsValue(ev: any){
    if(ev || ev === 0){
      setTimeout(()=> {
        this.hideBill = false
      }, 6000)
      this.webRTC.getUserTip(ev)
    }
  }


}
