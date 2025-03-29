import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';

@Component({
  selector: 'app-print-modal',
  templateUrl: './print-modal.page.html',
  styleUrls: ['./print-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PrintModalPage implements OnInit {

  form!: FormGroup
  salePoints: string[] = []


  hide: {
    name: boolean,
    point: boolean,
  } = {
    name: false,
    point: false,
  }
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService
  ) { }

  ngOnInit() {
    this.getData()
    this.setForm()
    this.startFlow()
  }

  getData(){
    const data  = this.navParams.get('options')
    if(data){
      this.salePoints = data
    }
  }

  async startFlow(){
    const point = await this.actionSheetService.entryAlert(this.salePoints, 'radio', 'Punct de lucru', 'Alege punctul de lucru', '', '')
    if(point){
      this.hide.point = true
      this.form.get('salePoint')?.setValue(point)
    }
    const name = await this.actionSheetService.textAlert('Nume', 'Alege numele serverului', 'nr', 'Nume')
    if(name){
      this.hide.name = true
      this.form.get('name')?.setValue(name)

    }
  }


    setForm(){
      this.form = new FormGroup({
        name: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required]
        }),
        salePoint: new FormControl(null, {
          updateOn: 'change',
          validators: [Validators.required]
        }),
      });
    }


    cancel(){
      this.modalCtrl.dismiss(null)
    }

    confirm(){
      if(this.form.valid){
        this.modalCtrl.dismiss({
          name: this.form.value.name,
          salePoint: this.form.value.salePoint
        })
      }
    }
}
