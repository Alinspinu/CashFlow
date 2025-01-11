import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { InventaryService } from '../inventary.service';
import { showToast } from 'src/app/shared/utils/toast-controller';

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
  um: string = ''
  ingID!: string

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private invService: InventaryService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const data = this.navParams.get('options')
    this.ingName = data.ingName
    this.logs = data.logs
    this.um = data.ingUm
    this.ingID = data.ingID
  }

  deleteLog(logID: string){
    this.invService.deleteLog(logID, this.ingID).subscribe({
      next: (response) => {
        const index = this.logs.findIndex(l => l._id === logID)
        if(index !== -1){
          this.logs.splice(index, 1)
        }
        showToast(this.toastCtrl, response.message, 3000)
      },
      error: (error) => {
        showToast(this.toastCtrl, error.message, 4000)
        console.log(error)
      }
    })
  }

  close(){
    this.modalCtrl.dismiss(null)
  }



  editDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
