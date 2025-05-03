import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { NirsService } from './nirs.service';
import { Router } from '@angular/router';
import { formatedDateToShow, round, roundOne } from 'src/app/shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import User from 'src/app/auth/user.model';
import { Record, Suplier } from 'src/app/models/suplier.model';
import { messageEFactura, Nir } from 'src/app/models/nir.model';
import { SelectDataPage } from 'src/app/modals/select-data/select-data.page';
import { RecordPage } from './record/record.page';
import { calcTotalDocs, mergeNirs } from './nirs.engine';
import { Preferences } from '@capacitor/preferences';
import { NirPage } from '../CRUD/nir/nir.page';
import { EFacturaPage } from '../e-factura/e-factura.page';
import { EService } from '../e-factura/e-factura.service';
import { Subscription } from 'rxjs';
import { SupliersService } from '../supliers/supliers.service';
import { MenuController } from '@ionic/angular';
import { SalePointService } from '../sale-point/sale-point.service';

@Component({
  selector: 'app-nirs',
  templateUrl: './nirs.page.html',
  styleUrls: ['./nirs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NirsPage implements OnInit, OnDestroy {

  nirs: Nir[] = []
  dbNirs: Nir[] = []

  supliers: Suplier[] = []
  supliersToSend: string[] = []

  supliersSub!: Subscription;
  eFacturaSub!: Subscription;
  nirsSub!: Subscription;

  startDate!: any
  endDate!: any
  user!: User
  suplierColor: string = 'none'
  dateColor: string = 'none'
  indexColor: string = 'primary'
  totalColor: string = 'none'
  dueDaysColor: string = 'none'

  totalDue: number = 0

  nirSearch!: string

  newBills: number = 0

  message: any

  suplierId!: string

  selectedNirs: Nir [] = []
  selectedNirsId: string[] = []

  selectedDocsNumber: string[] = []

  menuOpen: boolean = false

  pointId: string = ''


  constructor(
    public nirSrv: NirsService,
    @Inject(ActionSheetService) public actionSheetService: ActionSheetService,
    @Inject(MenuController) private menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private supliersService: SupliersService,
    public router: Router,
    private eService: EService,
    private pointService: SalePointService,
  ) { }

  ngOnInit() {
    this.getPointId()
    this.menuChange()
    setTimeout(() => {
      this.getNirs()
      this.getSupliers()
      this.getInvoicesStatus()
    }, 500)
  }


  ngOnDestroy(): void {
    if(this.eFacturaSub) this.eFacturaSub.unsubscribe()
    if(this.supliersSub) this.supliersSub.unsubscribe()
    if(this.nirsSub) this.nirsSub.unsubscribe()
  }


  getPointId(){
    this.pointService.pointSend$.subscribe({
      next: (point) => {
        if(point._id) this.pointId = point._id
      }
    })
  }

  getInvoicesStatus(){
    this.eService.eFacturaMessageSend$.subscribe({
      next: (message) => {
        this.message = message
        this.newBills = 0
        this.message.mesaje.forEach((m: any) => {
          if(!m.done){
            this.newBills ++
          }
        })
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



selectNir(nir: Nir){
  if(nir.selected){
   const index = this.selectedNirs.findIndex(n => n._id === nir._id)
   const idIndex = this.selectedNirsId.findIndex(n => n === nir._id)
   const docIndex = this.selectedDocsNumber.findIndex(n => n === nir.nrDoc)
   this.selectedNirs.splice(index, 1)
   this.selectedNirsId.splice(idIndex, 1)
   this.selectedDocsNumber.splice(docIndex, 1)
   nir.selected = false
   this.totalDue = round(this.totalDue - nir.totalDoc)
   if(!this.selectedNirs.length){
    this.calcTotalDue()
   }
  } else {
    if(this.selectedNirs.length){
      if(this.selectedNirs[0].suplier._id === nir.suplier._id){
        this.selectedNirs.push(nir)
        this.selectedNirsId.push(nir._id)
        this.selectedDocsNumber.push(nir.nrDoc)
        nir.selected = true
        this.totalDue = round(this.totalDue + nir.totalDoc)
      } else {
        showToast(this.toastCtrl, 'Nu poți selecta decât documente de la același furnizor!', 2000)
      }
    } else{
      this.totalDue = nir.totalDoc
      this.selectedNirs.push(nir)
      this.selectedNirsId.push(nir._id)
      this.selectedDocsNumber.push(nir.nrDoc)
      nir.selected = true
    }
  }
}




mergeNir(){
  const nir = mergeNirs(this.selectedNirs)
  Preferences.remove({key: 'nir'});
  Preferences.set({key: 'nir', value: JSON.stringify(nir)})
  Preferences.set({key: 'nirIds', value: JSON.stringify(this.selectedNirsId)})
  this.router.navigateByUrl(`/office/nir/${nir._id}`)
}

async eFactura(){
  await this.actionSheetService.openAdd(EFacturaPage, '', 'medium')
}



async selectSuplier(){
  const suplierName = await this.actionSheetService.openSelect(SelectDataPage, this.supliersToSend, 'supliers')
  if(suplierName === 'TOȚI FURNIZORII'){
     this.nirSrv.getNirs(this.pointId).subscribe()
   }
  if(suplierName && suplierName !== 'TOȚI FURNIZORII'){
    const suplier = this.supliers.find((suplier: any) => suplier.name === suplierName)
    if(suplier){
      this.nirSrv.getnirsBySuplier(suplier._id, this.pointId).subscribe({
        next: (response) => {
          this.calcTotalDue()
        },
        error: (error) => {
          console.log(error)
          showToast(this.toastCtrl, error.message, 2000)
        }
      })
    }
  }
}


updateNirsBySulier(){
  this.nirSrv.updateNirsBySuplier(this.suplierId).subscribe()
}

getNirs(){
  this.nirsSub = this.nirSrv.nirsSend$.subscribe(response => {
    if(response){
      this.dbNirs = response
      this.nirs = [...this.dbNirs]
      this.calcTotalDue()
    }
  })
}




async paySelectedNirs(){
  const ind = this.selectedNirs.findIndex(i => i.payd)
  if(ind === -1){
    const response = await this.actionSheetService.deleteAlert(`Vrei să asociezi plata documentului cu o plata deja existentă?`, 'Asociază plata')
    if(response){
      const suplier = this.supliers.find(s => s.name === this.selectedNirs[0].suplier.name)
      if(suplier){
        this.supliersService.getSuplier(suplier._id).subscribe({
          next: async (sup) => {
            const message = `Plata facturi: ${this.selectedDocsNumber.join(', ')} de la Slayer Cup`
            const data = {records: sup.records, total: calcTotalDocs(this.selectedNirs).total, date: this.selectedNirs.map(n => formatedDateToShow(n.documentDate).split('ora')[0]).join(', '),  nir: [], message, supId: suplier._id}
            await this.updatedocStatuNirPayment(data, true, this.selectedNirs)
          }
        })
      }
    }
  } else{
    showToast(this.toastCtrl, 'Nu poti plăti decât documente neplătite!', 3000)
  }
}


async payNir(nir: Nir, index: number){
  const suplier = this.supliers.find(s => s.name === nir.suplier.name)
  if(suplier){
    this.supliersService.getSuplier(suplier._id).subscribe({
      next: async (sup) => {
        if(nir.payd){
          const response = await this.actionSheetService.deleteAlert(`Ești sigur că vrei să marchezi documentul numărul - ${nir.nrDoc}, cu valoarea de ${nir.totalDoc}, ca neplătit?`, 'Anulează Plata!')
          if(response){
            const data = {records: sup.records, total: nir.totalDoc, date: formatedDateToShow(nir.documentDate).split('ora')[0], nir: [], message: '', sold: sup.sold, supId: sup._id}
            await this.updatedocStatuNirPayment(data, false,  [nir])
          }
        } else {
          const response = await this.actionSheetService.deleteAlert(`Vrei să asociezi plata documentului cu o plata deja existentă?`, 'Asociază plata')
          if(response){
            const message =  `Plata factura: ${nir.nrDoc} de la Slayer Cup`
            const data = {records: sup.records, total: nir.totalDoc, date: formatedDateToShow(nir.documentDate).split('ora')[0], nir: [], message, sold: sup.sold, supId: sup._id}
            await this.updatedocStatuNirPayment(data, true,  [nir])
          }
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}

async updatedocStatuNirPayment( data:{records: Record[], total: number, date: string, nir: Nir[], message: string, supId: string}, payment: boolean, nir: Nir[]){
  data.nir = nir
  const response = await this.actionSheetService.openAdd(RecordPage, data, 'medium-two')
  if(response){
    const record = response.record
    this.nirSrv.updateDocPaymentStatus(payment, response.nir, response.type).subscribe({
      next: (response) => {
        showToast(this.toastCtrl, 'Nirul și furnizorul au fost actualizati!', 2000)
      },
      error: (error) => {
        showToast(this.toastCtrl, error.message, 3000)
        console.log(error)
      }
    })
  }

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


  showDoDate(date: string){
    const now = new Date().getTime()
    const invoceDate = new Date(date).getTime()
    const dueDays =roundOne((now - invoceDate) / (1000 * 60 * 60 * 24))
    return dueDays
  }



  getSupliers(){
   this.supliersSub =  this.supliersService.supliersSend$.subscribe(response => {
      if(response){
        this.supliersToSend = []
        this.supliers = response.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.supliers.forEach(suplier => {
          this.supliersToSend.push(suplier.name)
        })
        const index = this.supliersToSend.findIndex(s => s === 'TOȚI FURNIZORII')
        if(index === -1){
          this.supliersToSend.unshift('TOȚI FURNIZORII')
        }
      }
    })
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


  async openDateModal(start: boolean){
    if(start){
      const response = await this.actionSheetService.openAuth(DatePickerPage)
        if(response){
          this.startDate = response
          const res = await this.actionSheetService.openAuth(DatePickerPage)
          if(res){
            this.endDate = res
              this.nirSrv.getNirsByDate(this.startDate, this.endDate, this.user.locatie, this.pointId).subscribe()
           }
         }
      } else {
        const res = await this.actionSheetService.openAuth(DatePickerPage)
        if(res && this.startDate){
          this.endDate = res
            this.nirSrv.getNirsByDate(this.startDate, this.endDate, this.user.locatie, this.pointId).subscribe()
         } else {
          showToast(this.toastCtrl, 'Trebuie să alegi întâi data de început!', 2000)
         }
       }
  }



  pushNirs(nir: any){
    this.nirs.push(nir)
  }

  editNir(id: string){
    this.actionSheetService.openAdd(NirPage, id, 'add-modal')
  }

  addNir(){
    this.actionSheetService.openAdd(NirPage, 'new', 'add-modal')
  }


  async deleteNir(id: string, index: number){
    const result = await this.actionSheetService.deleteAlert('Esti sigur că vrei să ștergi documentul?', "ȘTERGE NIR")
    if(result){
      this.nirSrv.deleteNir(id).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 2000)
        }
      })
    }
  }

  calcTotalDue(){
    this.totalDue = 0
    this.nirs.forEach(nir => {
      if(!nir.payd){
        this.totalDue = round(this.totalDue + nir.totalDoc)
      }
    })
  }





  formatedDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }


  roundInHtml(num: number){
    return round(num)
  }


  index(){
    this.nirs.sort((a, b) =>{
      if(a.index && b.index){
        return a.index - b.index
      }
      return 0
    })
    this.suplierColor = 'none'
    this.dateColor = 'none'
    this.indexColor = 'primary'
    this.totalColor= 'none'
    this.dueDaysColor = 'none'
  }


  date(){
    this.nirs.sort((a, b) =>{
      const dateA = new Date(a.documentDate).getTime()
      const dateB = new Date(b.documentDate).getTime()
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA;
      } else {
        return 0;
      }
    })
    this.suplierColor = 'none'
    this.dateColor = 'primary'
    this.indexColor = 'none'
    this.totalColor= 'none'
     this.dueDaysColor = 'none'
  }

  total(){
    this.nirs.sort((a,b) => b.totalDoc - a.totalDoc)
    this.suplierColor = 'none'
    this.dateColor = 'none'
    this.indexColor = 'none'
    this.totalColor = 'primary'
     this.dueDaysColor = 'none'
  }

  suplier(){
    this.nirs.sort((a,b) => a.suplier.name.localeCompare(b.suplier.name))
    this.totalColor= 'none'
    this.suplierColor = 'primary'
    this.dateColor = 'none'
    this.indexColor = 'none'
     this.dueDaysColor = 'none'
  }


  dueDays(){
    this.nirs.sort((a,b) => {
      if(a.payd !== b.payd){
        return a.payd ? 1 : -1
      }
      return this.showDoDate(b.documentDate) - this.showDoDate(a.documentDate)
    })
    this.totalColor= 'none'
    this.suplierColor = 'none'
    this.dateColor = 'none'
    this.indexColor = 'none'
     this.dueDaysColor = 'primary'

  }



}
