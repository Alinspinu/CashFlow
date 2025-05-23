import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuplierPage } from '../../suplier/suplier.page';
import { filter } from 'rxjs';
import { IonicModule, IonSearchbar, ToastController } from '@ionic/angular';
import { ActionSheetService } from '../../../../shared/action-sheet.service';
import { RandomService } from 'src/app/shared/random.service';
import { Preferences } from '@capacitor/preferences';
import { formatedDateToShow, round } from '../../../../shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { DiscountPage } from '../../../../modals/discount/discount.page';
import { SpinnerPage } from '../../../../modals/spinner/spinner.page';
import { emptyNir } from 'src/app/models/empty-models';
import { DatePickerPage } from '../../../../modals/date-picker/date-picker.page';
import { Nir, NirIngredient } from '../../../../models/nir.model';
import { NirService } from '../nir.service';
import User from '../../../../auth/user.model';
import { IonInput } from '@ionic/angular/standalone';
import { NirsService } from 'src/app/office/nirs/nirs.service';
import { SupliersService } from '../../../supliers/supliers.service';



@Component({
  selector: 'app-add-nir',
  templateUrl: './add-nir.page.html',
  styleUrls: ['./add-nir.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, SpinnerPage]
})
export class AddNirPage implements OnInit {

  @ViewChild('docInput', { static: false }) docInput!: IonInput;
  @ViewChild('searchBarSuplier', {static: false}) searchBarSuplier!: IonSearchbar
  @ViewChild('dateButton', {static: false}) dateButton!: ElementRef


  supliers: any = [];
  suplier!: any
  nir: Nir = emptyNir()

  nirIngredients: NirIngredient[] = []

  furnizorSearch: string = '';
  docDate!: string
  receptionDate!: string

  nirForm!: FormGroup

  editMode: boolean = false
  mergeMode: boolean = false

  user!: User

  discountMode: boolean = true
  nirIds: string[] = []


  isLoading: boolean = false

  val: number = 0;
  valTva: number = 0;
  valTotal: number = 0;
  valVanzare: number = 0;


  nirId!: string

  constructor(
    @Inject(ActionSheetService) private actionSht: ActionSheetService,
    private nirSrv: NirService,
    private nirsSrv: NirsService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private supliersService: SupliersService,
    private router: Router,
    private randomSrv: RandomService,
  ) { }



  ngOnInit() {
    this.router.events
    .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.setupNirForm()
      this.getNirToEdit()
      this.getNir()
    });
    this.setupNirForm()
    this.getNirToEdit()
    this.getNir()
  }






 async addSuplier(){
  const suplier = await this.actionSht.openModal(SuplierPage, true, false)
  this.suplier = suplier
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
  })

  setTimeout(()=> {
    if(this.editMode){
      this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
      this.nirForm.get('docDate')?.setValue(this.nir.documentDate)
      this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate)
      this.nirForm.get('document')?.setValue(this.nir.document)
    }
  }, 200)
}



async getNirToEdit(){
  this.route.paramMap.subscribe(async (paramMap) => {
    const id = paramMap.get('id');
      if(id && id !== "new" && id !== 'merged' && id !== 'eFactura') {
        this.isLoading = true
        this.nirSrv.getNir(id).subscribe(response => {
          if(response) {
            this.nir = response.nir
            // this.updateLogId()
            this.editMode = true
            this.isLoading = false
            this.nirSrv.setNir(this.nir)
            this.nirId = id
            this.suplier = this.nir.suplier
            this.nirForm.get('docDate')?.setValue(this.nir.documentDate)
            this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate)
            this.nirForm.get('document')?.setValue(this.nir.document)
            this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
            this.docDate = this.nir.documentDate
            this.receptionDate = this.nir.receptionDate
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
          this.isLoading = false
          this.nirSrv.setNir(this.nir)
          this.nirId = id
          this.suplier = this.nir.suplier
          this.docDate = this.nir.documentDate
          this.receptionDate = this.nir.receptionDate
          this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate)
          this.nirForm.get('document')?.setValue(this.nir.document)
          this.nirForm.get('document')?.setValue(this.nir.document)
        }
      }

      if(id && id === 'eFactura'){
        const nir = await Preferences.get({key: 'nir'})
        if(nir && nir.value){
          const parsedNir = JSON.parse(nir.value) as Nir
          const eFacturaNirTotal = parsedNir.totalDoc
          this.nir = parsedNir
          this.nirSrv.setNir(this.nir)
          this.nirSrv.clacTotals()
          const diference = round(this.nir.totalDoc - eFacturaNirTotal)
          if(diference > 1){
            const tva = this.nir.ingredients[0].tva
            const discountData ={
              type: 'val',
              tva,
              val: round(diference / (1 + (tva / 100)))
            }
            this.nirSrv.calcDiscount(discountData)
          }
          this.suplier = this.nir.suplier
          this.docDate = this.nir.documentDate
          this.receptionDate = this.nir.receptionDate
          this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
          this.nirForm.get('docDate')?.setValue(this.nir.documentDate)
          this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate)
          this.nirForm.get('document')?.setValue(this.nir.document)
        }
      }
      if(id === 'new'){
        this.nirSrv.setNir(emptyNir())
      }
  });
}

updateLogId(){
  this.nir.ingredients.forEach(ing => {
    ing.logId = this.randomSrv.generateRandomHexString(9)
  })
}




searchSuplierInDb(ev: any){
  const input = ev.detail.value
  this.supliers = this.supliersService.searchSuplier(input)
  if(input === ''){
    this.supliers = []
  }
}

  async selectSuplier(suplier: any){
    this.suplier = suplier;
     this.supliers = []
     this.furnizorSearch = ''
     const doc = await this.actionSht.entryAlert(['factura', 'bonFiscal'], 'radio', 'Document ','Alege tipul de document', '', '')
       if(doc){
         this.nirForm.get('document')?.setValue(doc)
         const number = await this.actionSht.textAlert('Numar document', 'Introdu numarul și seria documentului', 'nr', '')
         if(number){
           this.nirForm.get('nrDoc')?.setValue(number)
           const date = await this.actionSht.openPayment(DatePickerPage, '- DATĂ DOCUMENT')
           if(date){
             this.nirForm.get('docDate')?.setValue(date)
             this.docDate = date
             const recDate = await this.actionSht.openPayment(DatePickerPage, '- DATĂ RECEPȚE')
             if(recDate){
               this.nirForm.get('receptionDate')?.setValue(recDate)
               this.receptionDate = recDate
             }
           }
         }
       }
   }

  async openDateModal(mode: boolean){
   let title = mode ? '- DATĂ DOCUMENT':'- DATĂ RECEPȚIE'
     const date = await this.actionSht.openPayment(DatePickerPage, title)
     if(date){
       if(mode){
         this.nirForm.get('docDate')?.setValue(date)
         this.docDate = date
       } else {
         this.nirForm.get('receptionDate')?.setValue(date)
         this.receptionDate = date
       }
     }
   }





  async openDiscount(){
      const result = await this.actionSht.openPayment(DiscountPage, {nir: true})
      if(result.tva === 19 || result.tva === 9 || result.tva === 5 || result.tva === 0) {
        this.nirSrv.calcDiscount(result)
        this.discountMode = false
      } else {
       showToast(this.toastCtrl, "Valoarea TVA trebuie sa fie 19, 9, 5 sau 0", 3000)
      }
   }

   removeDiscount(){
    this.nirSrv.removeDiscount()
    this.discountMode = true
   }


  deleteEntry(index: number){
    if(this.nir.ingredients.length){
    this.nirSrv.redNirIng(index)
  }
}



  saveNir(){
    if(this.nirForm.valid){
      if(this.editMode) {
        this.nirsSrv.deleteNir(this.nirId).subscribe(response => {
          if(response && response.message){
            this.nir.documentDate = this.nirForm.value.docDate;
            this.nir.receptionDate = this.nirForm.value.receptionDate;
            this.nir.nrDoc = this.nirForm.value.nrDoc
            this.nir.suplier._id = this.suplier._id
            this.nir.document = this.nirForm.value.document
            this.nirsSrv.saveNir(this.nir).subscribe(response => {
              this.nirSrv.setNir(emptyNir())
              showToast(this.toastCtrl, "Nirul a fost editat cu success, stocul a fost actualizat!", 2000)
              this.router.navigateByUrl('/office/nirs')
            })
          }
        })
      } else {
        if(this.mergeMode){
          this.nirsSrv.deleteNirs(this.nirIds).subscribe({
            next: (response) => {
              showToast(this.toastCtrl, response.message, 3000)
              this.nir.documentDate = this.nirForm.value.docDate;
              this.nir.receptionDate = this.nirForm.value.receptionDate;
              this.nir.nrDoc = this.nirForm.value.nrDoc
              this.nir.suplier._id = this.suplier._id
              this.nir.document = this.nirForm.value.document
              this.nirsSrv.saveNir(this.nir).subscribe(response=> {
                this.nirSrv.setNir(emptyNir())
                this.router.navigateByUrl('/office/nirs')
                showToast(this.toastCtrl, response.message, 2000)
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
          this.nirsSrv.saveNir(this.nir).subscribe(response=> {
            this.nirSrv.setNir(emptyNir())
            this.router.navigateByUrl('/office/nirs')
            showToast(this.toastCtrl, response.message, 2000)
          })
        }
      }
    }
  }


  getNir(){
    this.nirSrv.nirSend$.subscribe(nir => {
        this.nir = nir
    })
  }




roundFor(num: number){
  return Math.round((num + Number.EPSILON) * 10000) / 10000;
}

formatDate(date: string){
  return formatedDateToShow(date).split('ora')[0]
}

}
