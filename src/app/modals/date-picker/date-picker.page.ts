import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonDatetime, IonicModule, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.page.html',
  styleUrls: ['./date-picker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatePickerPage implements OnInit {

  selectedDate!: string;
  date!: any
  mode!: string

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
   const mode = this.navParams.get('options')
   if(mode){
      this.mode = mode
   }
  }


  onCancel(){
    this.modalCtrl.dismiss(null)
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.modalCtrl.dismiss(this.selectedDate);
  }
}
