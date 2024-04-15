import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { WebRTCService } from 'src/app/content/webRTC.service';
import { round } from '../../../../../../CashFlow/src/app/shared/utils/functions';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class TipsPage implements OnInit {

  tipsValue!: number
  invite: string = 'invite'

  constructor(
    private modalCtrl: ModalController,
    private webRTC: WebRTCService,
  ) { }

  ngOnInit() {
    this.getUserTips()
  }




  close(){
    this.modalCtrl.dismiss(null)
  }

  addTips(){
    if(this.tipsValue || this.tipsValue === 0){
      this.modalCtrl.dismiss(this.tipsValue)
    }
  }

  getUserTips(){
    this.webRTC.getUserTipObservable().subscribe(response => {
      if(response || response === 0){
          this.tipsValue = round(response)
          this.invite = "invite"
        if(response === 0){
          this.tipsValue = 0
        }
      }
    })
  }


  inviteTip(invite: string){
    this.invite === 'invite' ? this.invite = 'uninvite' : this.invite = 'invite'
    this.webRTC.inviteUserToTip(invite)
  }
}
