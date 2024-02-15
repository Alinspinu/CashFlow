import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastButton, ToastController } from '@ionic/angular';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { NirsService } from './nirs.service';
import { Router } from '@angular/router';
import { formatedDateToShow, getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import User from 'src/app/auth/user.model';

@Component({
  selector: 'app-nirs',
  templateUrl: './nirs.page.html',
  styleUrls: ['./nirs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DatePickerPage]
})
export class NirsPage implements OnInit {

  nirs: any[] = []
  dbNirs: any[] = []

  nirSearch!: string

  suplierColor!: string
  indexColor!: string
  dateColor!: string

  startDate!: any
  endDate!: any
  user!: User
  total: number = 0

  constructor(
    public nirSrv: NirsService,
    @Inject(ActionSheetService) public actionSheetService: ActionSheetService,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public router: Router,
  ) { }

  ngOnInit() {
   this.getUser()
  }

getUser(){
  getUserFromLocalStorage().then(user => {
    if(user){
      this.user = user
      this.getNirs()
    } else {
      this.router.navigateByUrl('/auth')
    }
  })
}


index(){
  this.nirs.sort((a, b) => a.index - b.index)
  this.suplierColor = 'none'
  this.dateColor = 'none'
  this.indexColor = 'primary'
}


date(){
  this.nirs.sort((a, b) =>{
    const dateA = new Date(a.documentDate).getTime()
    const dateB = new Date(b.documentDate).getTime()
    if (!isNaN(dateA) && !isNaN(dateB)) {
      return dateA - dateB;
    } else {
      return 0;
    }
  })
  this.suplierColor = 'none'
  this.dateColor = 'primary'
  this.indexColor = 'none'
}

getNirs(){
  this.nirSrv.getNirs(this.user.locatie).subscribe(response => {
    if(response){
      this.dbNirs = response
      this.nirs = [...this.dbNirs]
    }
  })
}


searchNir(ev: any){
  const input = ev.detail.value
  let filterData = this.nirs.filter((object) =>
  object.suplier.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
  this.nirs = filterData
  if(!input.length){
    this.nirs = [ ...this.dbNirs]
  }

}


suplier(){
  console.log(this.nirs)
  this.nirs.sort((a,b) => a.suplier.name.localeCompare(b.suplier.name))

  this.suplierColor = 'primary'
  this.dateColor = 'none'
  this.indexColor = 'none'
}

  export(){
    if(this.startDate && this.endDate){
      this.nirSrv.exportNirs(this.startDate, this.endDate, this.user.locatie).subscribe(response => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Raport NIR ${this.formatedDate(this.startDate)}--${this.formatedDate(this.endDate)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
    }
  }



  async openDateModal(mode: string){
    const response = await this.actionSheetService.openAuth(DatePickerPage)
    if(response && mode === 'start'){
      this.startDate = response
    }
    if(response && mode === 'end'){
      this.endDate = response
    }
  }

  async payCash(id: string, index: number,  total: number){
    const nir = this.nirs[index]
    const name = nir.suplier.name
    const result = await this.actionSheetService.payAlert(`Plătește ${total} Lei`, 'Plată', 'Număr document')
    if(result && result !== 'banca'){
      let entry = {
        tip: 'expense',
        date: new Date(Date.now()).toISOString(),
        description: `Plata ${name}, ${result}`,
        amount: total,
        locatie: this.user.locatie
      }
      this.nirSrv.registerEntry(entry).subscribe(response => {
        if( response){
          showToast(this.toastCtrl, 'Pata efectuata registrul a fost actualizat', 2000)
          entry.locatie = '65c221374c46336d1e6ac423';
          this.nirSrv.registerEntry(entry).subscribe()
          this.nirSrv.payNir(true, 'cash', id).subscribe(response => {
            if(response) {
              nir.payd = true
              nir.type = 'cash'
              showToast(this.toastCtrl, response.message, 2000)
            }
          })
        }
      })
    } else if(result && result === 'banca'){
      this.nirSrv.payNir(true, "bank" ,id).subscribe(response => {
        if(response) {
          nir.payd = true
          nir.type = 'bank'
          showToast(this.toastCtrl, response.message, 2000)
        }
      })
    }

  }


  pushNirs(nir: any){
    this.nirs.push(nir)
  }

  editNir(id: string){
    this.router.navigateByUrl(`/tabs/office/nir/${id}`)
  }

  async deleteNir(id: string, index: number){
    const result = await this.actionSheetService.deleteAlert('Esti sigur că vrei să ștergi documentul?', "ȘTERGE NIR")
    if(result){
      this.nirSrv.deleteNir(id).subscribe(response => {
        if(response){
          this.nirs.splice(index, 1)
          showToast(this.toastCtrl, response.message, 2000)
        }
      })
    }
  }


  printNir(id: string) {
    this.nirSrv.printNir(id).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    })
  }

  addNir(){
    this.router.navigateByUrl('/tabs/office/nir/new')
  }

  formatedDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
