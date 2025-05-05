import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { WebRTCService } from 'src/app/content/webRTC.service';
import { round } from 'src/app/shared/utils/functions';


@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class TipsPage implements OnInit {

  tipsValue!: number
  pointId!: string

  constructor(
    private modalCtrl: ModalController,
    private webRTC: WebRTCService,
    private navPar: NavParams,
  ) { }

  ngOnInit() {
    this.getUserTips()
    this.inviteTip()
  }


  dismissModal(){
    this.modalCtrl.dismiss(null)
  }

  addTips(){
    if(this.tipsValue || this.tipsValue === 0){
      this.modalCtrl.dismiss(this.tipsValue)
    }
  }

  getUserTips(){
    this.webRTC.getUserTipObservable().subscribe(response => {
      const data = JSON.parse(response)
      if(data && data.point === this.pointId){     
        if(data.tips || data.tips === 0){
            this.tipsValue = round(data.tips)
          if(data.tips === 0){
            this.tipsValue = 0
          }
        }
      }
    })
  }


  inviteTip(){
    const data = this.navPar.get('options')
    if(data && data.invite === 'invite' && data.point){
      this.pointId = data.point
      this.webRTC.inviteUserToTip(JSON.stringify(data))
    }
  }
}
