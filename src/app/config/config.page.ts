import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ConfigService } from './config.service';
import { AuthService } from '../auth/auth.service';
import { showToast } from '../shared/utils/toast-controller';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfigPage implements OnInit {

  locatie!: any;
  locId!: any;


  show: {
    email: boolean
  } = {email: false}

  appKey!: string
  emailValue!: string



  constructor(
    private configSrv: ConfigService,
    private auth: AuthService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.getUser()

  }

  getUser(){
    this.auth.user$.subscribe(response => {
      if(response){
        response.subscribe(user => {
          if(user){
            this.locId = user.locatie
            this.getLoc()
          }
        })
      }
    })
  }


  getLoc(){
    if(this.locId){
      this.configSrv.fetchLocatie(this.locId).subscribe(response => {
        this.locatie = response
        if(this.locatie.gmail && this.locatie.gmail.email.length) {
          this.emailValue = this.locatie.gmail.email
        }
      })
    }
  }

  showKeyInfo(){

  }

  saveEmail(){
    const gmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if(gmailRegex.test(this.emailValue)){
      if(this.appKey.length){
        this.configSrv.saveServiceMail(this.emailValue,this.appKey, this.locId).subscribe(response => {
          if(response) {
              showToast(this.toastCtrl, response.message, 2000)
              this.emailValue = ''
              this.appKey = ''
          }
        })
      } else {
        showToast(this.toastCtrl, 'Trebuie sa introduci cheia de aplicatie', 2000)
      }
    } else{
      showToast(this.toastCtrl, 'Adresa de email trebuie sa fie de la google  eg. example@gmail.com', 2000)
    }
  }

  emailConfig(){
    this.show.email = true

  }

}
