import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-upload-log',
  templateUrl: './upload-log.page.html',
  styleUrls: ['./upload-log.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UploadLogPage implements OnInit {

  ingName: string = ''
  logs: any[] = []

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    const data = this.navParams.get('options')
    this.ingName = data.ingName
    this.logs = data.logs
  }

  close(){
    this.modalCtrl.dismiss(null)
  }



  editDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
