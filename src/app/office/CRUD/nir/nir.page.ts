import { Component, Inject, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AddIngPage } from './add-ing/add-ing.page';
import { AddNirPage } from './add-nir/add-nir.page';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Nir } from 'src/app/models/nir.model';
import { Suplier } from 'src/app/models/suplier.model';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { NirsService } from '../../nirs/nirs.service';
import { SelectDataPage } from 'src/app/modals/select-data/select-data.page';


@Component({
  selector: 'app-nir',
  templateUrl: './nir.page.html',
  styleUrls: ['./nir.page.scss'],
  standalone: true,
  imports: [IonicModule, AddIngPage, AddNirPage, CommonModule, ReactiveFormsModule,]
})
export class NirPage implements OnInit {

  nirForm!: FormGroup
  nir!: Nir
  suplier!: Suplier

  supliers: Suplier[] = []
  supliersToSend: string[] = []

  editMode: boolean = false

  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private nirService: NirsService,
  ) { }

  ngOnInit() {
    this.setupNirForm()
    this.getSupliers()
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
      const suplierName = await this.actionSheet.openSelect(SelectDataPage, this.supliersToSend, 'data')
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
    this.nirService.getSuplier('').subscribe(response => {
      if(response){
        this.supliers = response.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.supliers.forEach(suplier => {
          this.supliersToSend.push(suplier.name)
        })
      }
    })
  }


}
