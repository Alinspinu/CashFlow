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

  constructor(
    private modalCtrl: ModalController,
    private webRTC: WebRTCService,
    private navPar: NavParams,
  ) { }

  ngOnInit() {
    this.getUserTips()
    this.inviteTip()
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
        if(response === 0){
          this.tipsValue = 0
        }
      }
    })
  }


  inviteTip(){
    const invite = this.navPar.get('options')
    if(invite === 'invite'){
      this.webRTC.inviteUserToTip(invite)
    }
  }
}
