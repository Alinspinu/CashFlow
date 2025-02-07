import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { NirsService } from '../../nirs/nirs.service';
import { Nir } from 'src/app/models/nir.model';
import { SpinnerPage } from 'src/app/modals/spinner/spinner.page';
import { formatedDateToShow, round } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-nirs-modal',
  templateUrl: './nirs-modal.page.html',
  styleUrls: ['./nirs-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NirsModalPage implements OnInit {

  suplierNirs: Nir[] = []
  docNumber!: string;
  docDate!: string;
  eFacturaID!: string
  disableButton: boolean = true

  nir!: Nir| undefined

  constructor(
    private nirService: NirsService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getSuplierID()
  }


  getSuplierID(){
    const data = this.navParams.get('options');
    if(data){
      this.docDate = data.docDate
      this.docNumber = data.docNumber
      this.eFacturaID = data.eFacturaID
      console.log(data)
      this.getNirs(data.id)
    }
  }

  getNirs(id: string){
    this.nirService.getnirsBySuplier(id).subscribe({
      next: (response) => {
        this.suplierNirs = response
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  selectNir(nir: Nir){
    if(nir.selected){
      this.nir = undefined
      nir.selected = false
      this.disableButton = true
    } else{
      this.nir = nir
      this.disableButton = false
      this.resetNirs()
      nir.selected = true

    }
  }

  resetNirs(){
    for(let nir of this.suplierNirs){
      nir.selected = false
    }
  }


  merge(){
    if(this.nir && this.eFacturaID){
      this.nirService.updateNirEFacturaStatus(this.nir._id, this.eFacturaID).subscribe({
        next: (response) => {
          this.modalCtrl.dismiss(response)
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

  roundInHtml(num: number) {
    return round(num)
  }

  formateDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
