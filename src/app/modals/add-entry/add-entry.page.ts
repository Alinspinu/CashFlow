import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from '../date-picker/date-picker.page';
import { formatedDateToShow } from 'src/app/shared/utils/functions';

// interface Data {
//   ing: {
//     _id: string,
//     qty: number
//   }[],
//   mode: string,
//   ingId: string,
// }

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.page.html',
  styleUrls: ['./add-entry.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddEntryPage implements OnInit {
  form!: FormGroup;
  coffee: boolean = false
  date!:any
  locatie!: string


  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private navPar: NavParams,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
  ) { }


  ngOnInit() {
   this.locatie = this.navPar.get('options')
   console.log(this.locatie)
   this.setForm()
  }



  cancel(){
    this.modalCtrl.dismiss(null)
  }

  setForm(){
    this.form = new FormGroup({
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      typeOfEntry: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),

    });
  }


  async openDateModal(){
    const response = await this.actionSheet.openAuth(DatePickerPage)
    if(response){
      this.date = response
    }

  }
  formatDate(date: any){
    return formatedDateToShow(date).split('ora')[0]
  }



  confirm(){
    if(this.form.valid && this.date){
      let entry = {
        tip: this.form.value.typeOfEntry,
        date: this.date,
        description: this.form.value.description,
        amount: this.form.value.price,
        locatie: this.locatie
      }
      this.http.post(`${environment.BASE_URL}register/add-entry`, entry).subscribe(response => {
        if(response && this.locatie !== '65c221374c46336d1e6ac423'){
          entry.locatie = '65c221374c46336d1e6ac423'
          this.http.post(`${environment.BASE_URL}register/add-entry`, entry).subscribe(response => {
            this.modalCtrl.dismiss(response)
          })
        } else {
          this.modalCtrl.dismiss(response)
        }
      })
    }
  }



}
