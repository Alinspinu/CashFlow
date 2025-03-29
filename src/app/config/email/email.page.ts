import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { ConfigService } from '../config.service';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EmailPage implements OnInit {


  menuOpen: boolean = false
  appKey!: string
  emailValue!: string
  locatie: any

  constructor(
    private configSrv: ConfigService,
    private toastCtrl: ToastController,
    private menuCtrl: MenuController,
  ) { }

  ngOnInit() {
    this.menuChange()
    this.getData()
  }


  getData(){
    this.configSrv.fetchLocatie().subscribe(response => {
      this.locatie = response
      if(this.locatie.gmail && this.locatie.gmail.email.length) {
        this.emailValue = this.locatie.gmail.email
      }
    })
  }


  showKeyInfo(){

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

}
