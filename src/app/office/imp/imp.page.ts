import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import User from 'src/app/auth/user.model';
import { ImpService } from './imp.service';
import { ImpSheet } from 'src/app/models/nir.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { AddImpPage } from './add-imp/add-imp.page';
import { Subscription } from 'rxjs';
import { SalePointService } from '../sale-point/sale-point.service';

@Component({
  selector: 'app-imp',
  templateUrl: './imp.page.html',
  styleUrls: ['./imp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ImpPage implements OnInit, OnDestroy {

  ings: any[] = []

  users: User[] = []
  user!: User | undefined
  usersNames: string[] = []

  sheetIng: any[] = []
  date!: any


  sheets: ImpSheet[] = []
  pointSub!: Subscription


  constructor(
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService,
    private impSrv: ImpService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private pointService: SalePointService,
  ) { }



  ngOnInit() {
this.getPointId()
  }

  getPointId(){
    this.pointSub = this.pointService.pointSend$.subscribe({
      next: (p) => {
        if(p._id) {
          this.getSheets(p._id)
        }
      }
    })
  }

  ngOnDestroy(): void {
    if(this.pointSub) this.pointSub.unsubscribe()
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

  getSheets(p: string){
    this.impSrv.getSheets(p).subscribe({
      next: (sheets) => {
        this.sheets = sheets
        console.log(this.sheets)
      },
      error: (error) => {
        console.log(error)
        showToast(this.toastCtrl, error.message, 4000)
      }
    })
  }



  async showSheet(sheet: ImpSheet){
    const copiedSheet = JSON.parse(JSON.stringify(sheet))
    const editedSheet = await this.actionSheetService.openAdd(AddImpPage, copiedSheet, 'medium')
    if(editedSheet){
      if(editedSheet._id){
        const index = this.sheets.findIndex(s => s._id === sheet._id)
        if(index !== -1){
          this.sheets[index] = editedSheet
        }
      } else {
        const index = this.sheets.findIndex(s => s._id === editedSheet)
        if(index !== -1){
          this.sheets.splice(index, 1)
        }
      }
    }
  }

  async newSheet(){
    const sheet = await this.actionSheetService.openAdd(AddImpPage, false, 'medium')
    if(sheet){
        this.sheets.unshift(sheet)
    }
  }




  formatedDate(date: string | Date){
    return formatedDateToShow(date).split('ora')[0]
  }

}
