import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RecipeMakerPage } from '../CRUD/recipe-maker/recipe-maker.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { UsersService } from '../users/users.service';
import User from 'src/app/auth/user.model';
import { SelectDataPage } from 'src/app/modals/select-data/select-data.page';
import { ImpService } from './imp.service';
import { ImpSheet } from 'src/app/models/nir.model';
import { environment } from 'src/environments/environment';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-imp',
  templateUrl: './imp.page.html',
  styleUrls: ['./imp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RecipeMakerPage]
})
export class ImpPage implements OnInit {

  ings: any[] = []

  users: User[] = []
  user!: User | undefined
  usersNames: string[] = []

  sheetIng: any[] = []
  date!: any

  newSheet: boolean = false

  sheets: ImpSheet[] = []


  constructor(
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService,
        private usersSrv: UsersService,
        private impSrv: ImpService,
        private toastCtrl: ToastController,
  ) { }



  ngOnInit() {
    this.getUsers()
    this.getSheets()
  }

  getSheets(){
    this.impSrv.getSheets().subscribe({
      next: (sheets) => {
        this.sheets = sheets
      },
      error: (error) => {
        console.log(error)
        showToast(this.toastCtrl, error.message, 4000)
      }
    })
  }

  newSheeet(){
    this.newSheet = true
    this.sheetIng = []
    this.ings = []
    this.date = undefined
    this.user = undefined
    this.openDateModal()
  }

  showSheet(sheet: ImpSheet){
    this.user = sheet.user
    this.date = sheet.date
    this.ings = sheet.ings
    this.newSheet = false
  }

  deleteSheet(id: string | undefined){
    this.impSrv.deleteSheet(id).subscribe({
      next: (response) => {
        const index = this.sheets.findIndex(s=> s._id === id)
        this.sheets.splice(index, 1)
        showToast(this.toastCtrl, response.message, 3000)
      },
      error: (error) => {
        console.log(error)
        showToast(this.toastCtrl, error.message, 4000)
      }
    })
  }

  saveSheet(){
    if(this.user && this.date){
      const sheet: ImpSheet = {
        date: new Date(this.date),
        locatie: environment.LOC,
        ings: this.sheetIng,
        user: this.user._id,
      }
      this.impSrv.saveSheet(sheet).subscribe({
        next: (response) => {
          if(response.sheet){
            this.sheets.push(response.sheet)
            this.sheetIng = []
            this.ings = []
            this.date = ''
            this.user = undefined
          }
          showToast(this.toastCtrl, response.message, 3000)
        },
        error: (error) => {
          console.log(error)
          showToast(this.toastCtrl, error.message, 4000)
        }
      })
    }
  }

  getUsers(){
    this.usersSrv.usersSend$.subscribe({
      next: (users) => {
        this.users = users.filter(u => u.employee?.active === true)
        this.usersNames = this.users.map(u => u.employee.fullName)
      }
    })
  }



  onIngRecive(ev: any){
    this.sheetIng = ev
  }



  async openDateModal(){
    const response = await this.actionSheetService.openAuth(DatePickerPage)
      if(response){
        this.date = response
        const user = await this.actionSheetService.openSelect(SelectDataPage, this.usersNames, 'data')
        if(user){
          this.user = this.users.find(u => u.employee.fullName === user)
        }
    }
  }

    formatedDate(date: string | Date){
      return formatedDateToShow(date).split('ora')[0]
    }

}
