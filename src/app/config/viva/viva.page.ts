import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { ConfigService } from '../config.service';
import { showToast } from 'src/app/shared/utils/toast-controller';


@Component({
  selector: 'app-viva',
  templateUrl: './viva.page.html',
  styleUrls: ['./viva.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VivaPage implements OnInit {

  menuOpen: boolean = false
  locatie: any
  ipValue!: string
  portValue!: string

  constructor(
    private menuCtrl: MenuController,
    private configSrv: ConfigService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.menuChange()
    this.getData()
  }


  getData(){
    this.configSrv.fetchLocatie().subscribe(response => {
      this.locatie = response
      if(this.locatie.pos && this.locatie.pos.vivaWalletLocal.ip){
        this.ipValue = this.locatie.pos.vivaWalletLocal.ip
      }
      if(this.locatie.pos && this.locatie.pos.vivaWalletLocal.port){
        this.portValue = this.locatie.pos.vivaWalletLocal.port
      }
    })
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
