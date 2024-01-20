import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

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

  constructor(
    private modalCtrl: ModalController,
    private navPar: NavParams
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
      generalDiscount: new FormControl(null, {
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
      this.form.get('access')?.setValue(this.data.access.toString());
      this.form.get('generalDiscount')?.setValue(this.data.discount.general);
    }
  }

  onSubmit(){
    const dataToSend = {
      fullName: this.form.value.fullName,
      cnp: this.form.value.cnp,
      ciSerial: this.form.value.ciSerial,
      ciNumber: this.form.value.ciNumber,
      address: this.form.value.address,
      position: this.form.value.position,
      access: +this.form.value.access
    }
    this.modalCtrl.dismiss(dataToSend)
  }

  close(){
    this.modalCtrl.dismiss(null)
  }
}
