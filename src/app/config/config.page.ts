import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ModalController, ToastController } from '@ionic/angular';
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

  menuOpen: boolean = false


  show: {
    email: boolean, viva: boolean
  } = {email: false, viva: false}

  appKey!: string
  emailValue!: string
  ipValue!: string
  portValue!: string



  constructor(
    private configSrv: ConfigService,
    private auth: AuthService,
    private toastCtrl: ToastController,
    private menuCtrl: MenuController,
  ) { }

  ngOnInit() {
    this.getUser()
    this.menuChange()

  }

  getUser(){
    this.auth.user$.subscribe(response => {
      if(response){
        this.locId = response.locatie
        this.getLoc()
      }
    })
  }

  private async menuChange(){
    const menu = await this.menuCtrl.get('start');
    if (menu) {
      menu.addEventListener('ionDidClose', () => {
        this.menuOpen = false
      });
      menu.addEventListener('ionDidOpen', () => {
           this.menuOpen = true
      });
    }
  }


  getLoc(){
    if(this.locId){

    }
  }

  showKeyInfo(){

  }

  saveData(){
    if(this.ipValue.length && this.portValue.length){
      this.configSrv.savePosData(this.ipValue, this.portValue).subscribe(response => {
        showToast(this.toastCtrl, response.message, 2000)
        this.ipValue = ''
        this.portValue = ''
      })
    } else {
      showToast(this.toastCtrl, 'Trebuie să completezi câmpurile', 2000)
    }
  }

  saveEmail(){
    const gmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if(gmailRegex.test(this.emailValue)){
      if(this.appKey.length){
        this.configSrv.saveServiceMail(this.emailValue,this.appKey).subscribe(response => {
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
    this.show.viva = false
  }

  vivaWalletConfig(){
    this.show.viva = true
    this.show.email = false
  }

}
