import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Pontaj } from '../../../models/shedule.model';
import { PontajService } from '../pontaj.service';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-toggle-pont',
  templateUrl: './toggle-pont.page.html',
  styleUrls: ['./toggle-pont.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TogglePontPage implements OnInit {

  pontaj: Pontaj[] = []
  isLoading: boolean = false
  pointId!: string 

  constructor(
    private modalCtrl: ModalController,
    private pontSrv: PontajService,
    private toastCtrl: ToastController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    this.pointId = this.navParams.get('options')
    if(this.pointId){
      this.getPont()
    }
  }

  choisePont(shedule: Pontaj){
    this.modalCtrl.dismiss(shedule)
  }

  getPont(){
    this.pontSrv.getAllPont(this.pointId).subscribe(response => {
      this.pontaj = response
      this.pontaj.sort( (a, b) => {
        const dateA = new Date(a.days[0].date).getTime()
        const dateB = new Date(b.days[0].date).getTime()
        return dateA - dateB
      })
    })
  }

  addPontaj(){
    let month = new Date(this.pontaj[this.pontaj.length - 1].days[0].date).getMonth() + 1
    let year = new Date(this.pontaj[this.pontaj.length - 1].days[0].date).getFullYear()
    if(month === 12){
      month = 0
      year += 1
    }
    this.isLoading = true
    this.pontSrv.addPont(month, year, this.pointId).subscribe(response => {
      if(response){
        this.pontaj.push(response)
        this.isLoading = false
      }
    })
  }

  deletePontaj(id: string){
    this.isLoading = true
    this.pontSrv.deletePont(id).subscribe(response => {
      if(response){
        const index = this.pontaj.findIndex(p => p._id === id)
        this.pontaj.splice(index, 1)
        showToast(this.toastCtrl, response.message, 2000)
        this.isLoading = false
      }
    })
  }

}
