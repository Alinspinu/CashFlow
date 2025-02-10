import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow, round } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';

@Component({
  selector: 'app-add-employee-data',
  templateUrl: './add-employee-data.page.html',
  styleUrls: ['./add-employee-data.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddEmployeeDataPage implements OnInit {

  form!: FormGroup
  data!: any

  startDate!: string
  endDate!: string
  birthDate!: string


  constructor(
    private modalCtrl: ModalController,
    private navPar: NavParams,
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService
  ) { }

  ngOnInit() {
    this.getData()
    this.setUpForm()
  }



  getData(){
    this.data = this.navPar.get('options');
  }

  setUpForm(){
    this.form = new FormGroup({
      fullName: new FormControl(null, {
        updateOn: 'change',
      }),
      cnp: new FormControl(null, {
        updateOn: 'change',
      }),
      ciSerial: new FormControl(null, {
        updateOn: 'change',
      }),
      ciNumber: new FormControl(null, {
        updateOn: 'change',
      }),
      address: new FormControl(null, {
        updateOn: 'change',
      }),
      position: new FormControl(null, {
        updateOn: 'change',
      }),
      access: new FormControl(null, {
        updateOn: 'change',
      }),
      salary: new FormControl(null, {
        updateOn: 'change',
      }),
      zodie: new FormControl(null, {
        updateOn: 'change',
      }),
      onPaper: new FormControl(null, {
        updateOn: 'change',
      }),
      fix: new FormControl(null, {
        updateOn: 'change',
      }),
      norm: new FormControl(null, {
        updateOn: 'change',
      }),
      status: new FormControl(null, {
        updateOn: 'change',
      }),
    });
    if(this.data){
      this.form.get('fullName')?.setValue(this.data.fullName);
      this.form.get('cnp')?.setValue(this.data.cnp);
      this.form.get('ciSerial')?.setValue(this.data.ciSerial);
      this.form.get('ciNumber')?.setValue(this.data.ciNumber);
      this.form.get('address')?.setValue(this.data.address);
      this.form.get('position')?.setValue(this.data.position);
      this.form.get('zodie')?.setValue(this.data.zodie ? this.data.zodie : '');
      if(this.data.access){
        this.form.get('access')?.setValue(this.data.access.toString());
      }
      if(this.data.salary){
        this.form.get('salary')?.setValue(this.data.salary.inHeand);
        this.form.get('onPaper')?.setValue(this.data.salary.onPaper.salary);
        this.form.get('norm')?.setValue(this.data.salary.norm);
        this.form.get('fix')?.setValue(this.data.salary.fix ? this.data.salary.fix : false );
      }
      this.form.get('status')?.setValue(this.data.active);
      this.startDate = this.data.startDate
      this.endDate = this.data.endDate
      this.birthDate = this.data.birthDate
    }
  }

  onSubmit(){
    const dataToSend: any = {
      active: this.form.value.status,
      startDate: this.startDate,
      endDate: this.endDate,
      birthDate: this.birthDate,
      fullName: this.form.value.fullName,
      cnp: this.form.value.cnp,
      ciSerial: this.form.value.ciSerial,
      ciNumber: this.form.value.ciNumber,
      address: this.form.value.address,
      position: this.form.value.position,
      zodie: this.form.value.zodie,
      access: +this.form.value.access,
      salary: {
        inHeand: this.form.value.salary,
        onPaper: {
          salary:  this.form.value.onPaper,
          tax: round(this.form.value.onPaper * 0.4)
        },
        norm: this.form.value.norm,
        fix: this.form.value.fix
      },
      workLog: this.data.workLog,
      payments: this.data.payments

    }
    if(!this.startDate){
     delete dataToSend.startDate
    }
    if(!this.endDate){
      delete dataToSend.endDate
    }
    this.modalCtrl.dismiss(dataToSend)
  }

  close(){
    this.modalCtrl.dismiss(null)
  }



  async openDateModal(start: boolean | string){
      const response = await this.actionSheetService.openAuth(DatePickerPage)
        if(response){
          if(start === 'birth'){
            this.birthDate = response
          } else {
            if(start === true){
              this.startDate = response
            } else {
              this.endDate = response
            }
          }
       }
       console.log(this.birthDate)
       console.log(this.startDate)
       console.log(this.endDate)
}

formatedDate(date: string){
  return formatedDateToShow(date).split('ora')[0]
}

}
