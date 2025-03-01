import { Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { IonContent, IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Nir } from 'src/app/models/nir.model';
import { Suplier } from 'src/app/models/suplier.model';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { formatedDateToShow, round } from 'src/app/shared/utils/functions';
import { NirsService } from '../../nirs/nirs.service';
import { SelectDataPage } from 'src/app/modals/select-data/select-data.page';
import { NirService } from './nir.service';
import { Preferences } from '@capacitor/preferences';
import { emptyNir } from 'src/app/models/empty-models';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { AddIngPage } from './add-ing/add-ing.page';
import { Subscription } from 'rxjs';
import { DiscountPage } from 'src/app/modals/discount/discount.page';
import { SupliersService } from '../../supliers/supliers.service';


@Component({
  selector: 'app-nir',
  templateUrl: './nir.page.html',
  styleUrls: ['./nir.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class NirPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;
  isHidden = false;
  lastScrollTop = 0;

  nirForm!: FormGroup
  nir: Nir = emptyNir()
  suplier!: Suplier

  nirSub!: Subscription;
  supliersSub!: Subscription;

  nirId!: string
  nirIds: string[] = []

  discountMode: boolean = true

  supliers: Suplier[] = []
  supliersToSend: string[] = []

  editMode: boolean = false
  mergeMode: boolean = false

  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private nirsService: NirsService,
    private nirService: NirService,
    private supliersService: SupliersService,
     private navParams: NavParams,
     private modalCtrl: ModalController,
     private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.setupNirForm()
    this.getSupliers()
    this.getNirToEdit()
    this.getNir()
  }

  ngOnDestroy(): void {
      if(this.nirSub) {
        this.nirSub.unsubscribe()
      }
  }


  getNir(){
    this.nirService.nirSend$.subscribe({
      next: (nir) => {
        this.nir = nir
      }
    })
  }




  onScroll(event: any) {
    // let scrollTop = event.detail.scrollTop;
    // if (scrollTop < 150) {
    //   this.isHidden = false;
    // } else {
    //   this.isHidden = true;
    // }
  }


  async addIng(mode: boolean = false){
    const ing = await this.actionSheet.openAdd(AddIngPage, mode, 'add-modal')
    if(ing) {
      this.addIng(true)
    }
  }

    async openDiscount(){
        const result = await this.actionSheet.openAdd(DiscountPage, {nir: true}, 'small')
        if(result.tva === 19 || result.tva === 9 || result.tva === 5 || result.tva === 0) {
          this.nirService.calcDiscount(result)
          this.discountMode = false
        } else {
         showToast(this.toastCtrl, "Valoarea TVA trebuie sa fie 19, 9, 5 sau 0", 3000)
        }
     }

     removeDiscount(){
      this.nirService.removeDiscount()
      this.discountMode = true
     }



setupNirForm(){
  this.nirForm = new FormGroup({
    nrDoc: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
    docDate: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
    receptionDate: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
    document: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
    suplier: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
    cif: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
  })

  setTimeout(()=> {
    if(this.editMode){
      this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
      this.nirForm.get('docDate')?.setValue(this.nir.documentDate)
      this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate)
      this.nirForm.get('document')?.setValue(this.nir.document)
      this.nirForm.get('suplier')?.setValue(this.nir.suplier.name)
      this.nirForm.get('cif')?.setValue(this.nir.suplier.vatNumber)
    }
  }, 200)
}

  async openDateModal(mode: boolean){
   let title = mode ? '- DATĂ DOCUMENT':'- DATĂ RECEPȚIE'
     const date = await this.actionSheet.openPayment(DatePickerPage, title)
     if(date){
       const formatedDate = date.split('T')[0]
       if(mode){
        console.log(new Date(formatedDate))
         this.nirForm.get('docDate')?.setValue(formatedDate)
       } else {
         this.nirForm.get('receptionDate')?.setValue(formatedDate)
       }
     }
   }

   formatDate(date: string){
     return formatedDateToShow(date).split('ora')[0]
    }

    async selectSuplier(){
      const suplierName = await this.actionSheet.openSelect(SelectDataPage, this.supliersToSend, 'supliers')
      console.log(suplierName)
      if(suplierName){
        const suplier = this.supliers.find((suplier: any) => suplier.name === suplierName)
        if(suplier){
          this.suplier = suplier
          this.nirForm.get('suplier')?.setValue(this.suplier.name)
          this.nirForm.get('cif')?.setValue(this.suplier.vatNumber)
          const doc = await this.actionSheet.entryAlert(['factura', 'bonFiscal'], 'radio', 'Document ','Alege tipul de document', '', '')
          if(doc){
            this.nirForm.get('document')?.setValue(doc)
            const number = await this.actionSheet.textAlert('Numar document', 'Introdu numarul și seria documentului', 'nr', '')
            if(number){
              this.nirForm.get('nrDoc')?.setValue(number)
              const date = await this.actionSheet.openPayment(DatePickerPage, '- DATĂ DOCUMENT')
              if(date){
                const formatedDate = date.split('T')[0]
                this.nirForm.get('docDate')?.setValue(formatedDate)
                const recDate = await this.actionSheet.openPayment(DatePickerPage, '- DATĂ RECEPȚE')
                if(recDate){
                  const formatedRecDate = recDate.split('T')[0]
                  this.nirForm.get('receptionDate')?.setValue(formatedRecDate)
                }
              }
            }
          }
        }
      }
    }


  getSupliers(){
   this.supliersSub = this.supliersService.supliersSend$.subscribe(response => {
      if(response){
        this.supliers = response.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.supliers.forEach(suplier => {
          this.supliersToSend.push(suplier.name)
        })
      }
    })
  }

  deleteEntry(index: number){
    if(this.nir.ingredients.length){
    this.nirService.redNirIng(index)
  }
}


async getNirToEdit(){
    const id = this.navParams.get('options')
      if(id && id !== "new" && id !== 'merged' && id !== 'eFactura') {
        // this.isLoading = true
        this.nirService.getNir(id).subscribe(response => {
          if(response) {
            this.nir = response.nir
            // this.updateLogId()
            this.editMode = true
            // this.isLoading = false
            this.nirService.setNir(this.nir)
            this.nirId = id
            this.suplier = this.nir.suplier
            this.nirForm.get('document')?.setValue(this.nir.document)
            this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
            this.nirForm.get('docDate')?.setValue(this.nir.documentDate.split('T')[0])
            this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate.split('T')[0])
            this.nirForm.get('suplier')?.setValue(this.nir.suplier.name)
            this.nirForm.get('cif')?.setValue(this.nir.suplier.vatNumber)
          }
        })
      }
      if(id && id === 'merged'){
        const nir = await Preferences.get({key: 'nir'})
        const nirId = await Preferences.get({key: 'nirIds'})
        if(nirId && nirId.value){
          this.nirIds = JSON.parse(nirId.value)
          this.mergeMode = true
        }
        if(nir && nir.value){
          const parsedNir = JSON.parse(nir.value) as Nir
          this.nir = parsedNir
          // this.updateLogId()
          // this.isLoading = false
          this.nirService.setNir(this.nir)
          this.nirId = id
          this.suplier = this.nir.suplier
          this.nirForm.get('docDate')?.setValue(this.nir.documentDate.split('T')[0])
          this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate.split('T')[0])
          this.nirForm.get('document')?.setValue(this.nir.document)
          this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
          this.nirForm.get('suplier')?.setValue(this.nir.suplier.name)
          this.nirForm.get('cif')?.setValue(this.nir.suplier.vatNumber)
        }
      }

      if(id && id === 'eFactura'){
        const nir = await Preferences.get({key: 'nir'})
        if(nir && nir.value){
          const parsedNir = JSON.parse(nir.value) as Nir
          const eFacturaNirTotal = parsedNir.totalDoc
          this.nir = parsedNir
          this.nirService.setNir(this.nir)
          this.nirService.clacTotals()
          const diference = round(this.nir.totalDoc - eFacturaNirTotal)
          if(diference > 1){
            const tva = this.nir.ingredients[0].tva
            const discountData ={
              type: 'val',
              tva,
              val: round(diference / (1 + (tva / 100)))
            }
            this.nirService.calcDiscount(discountData)
          }
          this.suplier = this.nir.suplier
          this.nirForm.get('docDate')?.setValue(this.nir.documentDate.split('T')[0])
          this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate.split('T')[0])
          this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
          this.nirForm.get('document')?.setValue(this.nir.document)
          this.nirForm.get('suplier')?.setValue(this.nir.suplier.name)
          this.nirForm.get('cif')?.setValue(this.nir.suplier.vatNumber)
        }
      }
      if(id === 'new'){
        this.nirService.setNir(emptyNir())
      }
   }

     saveNir(){
       if(this.nirForm.valid){
         if(this.editMode) {
           this.nirsService.deleteNir(this.nirId).subscribe(response => {
             if(response && response.message){
               this.nir.documentDate = this.nirForm.value.docDate;
               this.nir.receptionDate = this.nirForm.value.receptionDate;
               this.nir.nrDoc = this.nirForm.value.nrDoc
               this.nir.suplier._id = this.suplier._id
               this.nir.document = this.nirForm.value.document
               this.nirsService.saveNir(this.nir).subscribe(response => {
                 this.nirService.setNir(emptyNir())
                 showToast(this.toastCtrl, "Nirul a fost editat cu success, stocul a fost actualizat!", 2000)
                this.close()
               })
             }
           })
         } else {
           if(this.mergeMode){
             this.nirsService.deleteNirs(this.nirIds).subscribe({
               next: (response) => {
                 this.nir.documentDate = this.nirForm.value.docDate;
                 this.nir.receptionDate = this.nirForm.value.receptionDate;
                 this.nir.nrDoc = this.nirForm.value.nrDoc
                 this.nir.suplier._id = this.suplier._id
                 this.nir.document = this.nirForm.value.document
                 this.nirsService.saveNir(this.nir).subscribe(response=> {
                   this.nirService.setNir(emptyNir())
                   showToast(this.toastCtrl, response.message, 2000)
                   this.close()
                 })
               },
               error: (error) => {
                 console.log(error)
                 showToast(this.toastCtrl, error.message, 4000)
               }
             })
           } else {
             this.nir.documentDate = this.nirForm.value.docDate;
             this.nir.receptionDate = this.nirForm.value.receptionDate;
             this.nir.nrDoc = this.nirForm.value.nrDoc
             this.nir.suplier._id = this.suplier._id
             this.nir.document = this.nirForm.value.document
             this.nirsService.saveNir(this.nir).subscribe(response=> {
               this.nirService.setNir(emptyNir())
               showToast(this.toastCtrl, response.message, 2000)
               this.close()
             })
           }
         }
       }
     }

    close(){
    this.modalCtrl.dismiss(null)
    }

    async deleteNir(id: string){
      const result = await this.actionSheet.deleteAlert('Esti sigur că vrei să ștergi documentul?', "ȘTERGE NIR")
      if(result){
        this.nirsService.deleteNir(id).subscribe(response => {
          if(response){
            this.modalCtrl.dismiss(null)
            showToast(this.toastCtrl, response.message, 2000)
          }
        })
      }
    }

    printNir() {
      this.nirsService.printNir(this.nir._id).subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
      })
    }


}
