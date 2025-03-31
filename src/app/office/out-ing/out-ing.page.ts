import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { SheetService } from './out-ing.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { NewSheetModalPage } from './new-sheet-modal/new-sheet-modal.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { formatedDateToShow } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-out-ing',
  templateUrl: './out-ing.page.html',
  styleUrls: ['./out-ing.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OutIngPage implements OnInit {

  sheets: any[] = []
  sheet!: any
  constructor(
    private sheetService: SheetService,
    @Inject(ActionSheetService) private actionService: ActionSheetService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.getSheets()
  }


  getSheets(){
    this.sheetService.getSheets().subscribe({
      next: (res) => {
        this.sheets = res.sheets
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  async deleteSheet(id: string, index: number){
    const response = await this.actionService.deleteAlert('Ești sigur că vrei să ștergi fișa de iesiri?', 'Șterge!')
    if(response){
      this.sheetService.deleteSheet(id).subscribe({
        next: (res) => {
          this.sheet = null
          this.sheets.splice(index, 1)
          showToast(this.toastCtrl, res.message, 2000, 'success-toast')
        },
        error: (error) => {
          showToast(this.toastCtrl, error.message, 3000, 'error-toast')
          console.log(error)
        }
      })
    }

  }


  showSheet(sh: any){
    this.sheet = sh
  }


  async addNew(){
    const sheet = await this.actionService.openModal(NewSheetModalPage, '', false)
    if(sheet){
      this.sheetService.addSheet(sheet).subscribe({
        next: (res) => {
          this.sheets.unshift(res.sheet)
          showToast(this.toastCtrl, res.message, 2000, 'success-toast')
        },
        error : (error) => {
          console.log(error)
          showToast(this.toastCtrl, error.message, 3000, 'error-toast')
        }
      })
    }
  }

  formatDate(date: any){
    return formatedDateToShow(date).split('ora')[0]
  }

}
