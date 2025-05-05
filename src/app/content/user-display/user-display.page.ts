import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WebRTCService } from '../webRTC.service';
import { Bill} from 'src/app/models/table.model';
import { TipsPage } from './tips/tips.page';
import { MeniuPage } from './meniu/meniu.page';
import { SalePointService } from 'src/app/office/sale-point/sale-point.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.page.html',
  styleUrls: ['./user-display.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,  TipsPage, MeniuPage]
})
export class UserDisplayPage implements OnInit, OnDestroy {

  bill!: Bill | null
  hideBill: boolean = false
  pointSub!: Subscription;
  pointId!: string



  constructor(
    private webRTC: WebRTCService,
    private pointService: SalePointService,

  ) { }

  ngOnInit() {
    this.getPointId()
    this.getBill()
    this.getInvite()
  }

  ngOnDestroy(): void {
    if(this.pointSub) this.pointSub.unsubscribe()
  }

  getPointId(){
    this.pointSub = this.pointService.pointSend$.subscribe({
      next: (p) => {
        if(p._id) this.pointId = p._id
      }
    })
  }

  getBill(){
    this.webRTC.getProductAddedObservable().subscribe(response => {
      if(response){
        const order = JSON.parse(response)
        if(order.salePoint === this.pointId) this.bill = order
      }
      if(response === null){
        this.bill = null
      }
      })
  }


  getInvite(){
    this.webRTC.getInviteToTip().subscribe(response => {
      const data = JSON.parse(response)
      if(data && data.invite === 'invite' && data.point === this.pointId){
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
      this.webRTC.getUserTip(JSON.stringify({tips: +ev, point: this.pointId}))
    }
  }


}
