import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ImpSheet } from 'src/app/models/nir.model';
import { RecipeMakerPage } from '../../CRUD/recipe-maker/recipe-maker.page';
import { ImpService } from '../imp.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { UsersService } from '../../users/users.service';
import User from 'src/app/auth/user.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { SelectDataPage } from 'src/app/modals/select-data/select-data.page';
import { emptySheet } from 'src/app/models/empty-models';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { Subscription } from 'rxjs';
import { SalePointService } from '../../sale-point/sale-point.service';

@Component({
  selector: 'app-add-imp',
  templateUrl: './add-imp.page.html',
  styleUrls: ['./add-imp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RecipeMakerPage]
})
export class AddImpPage implements OnInit, OnDestroy {

  editMode: boolean = false
  sheet: ImpSheet = emptySheet()
  userName: string = ''


  ings: any[] = []

  users: User[] = []
  user!: User | undefined

  usersNames: string[] = []

  userSub!: Subscription
  pointSub!: Subscription



  constructor(
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private impSrv: ImpService,
    private toastCtrl: ToastController,
    private usersSrv: UsersService,
    private pointService: SalePointService,
  ) { }

  ngOnInit() {
    this.getPointId()
    this.getSheet()
    this.getUsers()
  }

  ngOnDestroy(): void {
    if(this.userSub) this.userSub.unsubscribe()
    if(this.pointSub) this.pointSub.unsubscribe()
  }


  getPointId(){
    this.pointSub = this.pointService.pointSend$.subscribe({
      next: (p) => {
        if(p._id){
          this.sheet.salePoint = p._id
        }
      }
    })
  }

  getSheet(){
    const sheet = this.navParams.get('options')
    if(sheet) {
      this.sheet = sheet
      this.editMode = true
      this.userName = this.sheet.user.employee.fullName
    } else {
      this.openDateModal()
    }
  }


  onIngRecive(ev: any){
    this.sheet.ings = ev
  }


  close(){
    this.modalCtrl.dismiss(null)
  }

  deleteSheet(id: string | undefined){
    this.impSrv.deleteSheet(id).subscribe({
      next: (response) => {
        this.modalCtrl.dismiss(id)
        showToast(this.toastCtrl, response.message, 3000)
      },
      error: (error) => {
        console.log(error)
        showToast(this.toastCtrl, error.message, 4000)
      }
    })
  }

  saveSheet(){
    if(this.user || this.editMode){
      this.impSrv.saveSheet(this.sheet).subscribe({
        next: (response) => {
          if(response.sheet){
            this.modalCtrl.dismiss(response.sheet)
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
   this.userSub = this.usersSrv.usersSend$.subscribe({
      next: (users) => {
        this.users = users.filter(u => u.employee?.active === true)
        this.usersNames = this.users.map(u => u.employee.fullName)
      }
    })
  }

    async openDateModal(){
      const response = await this.actionSheetService.openAuth(DatePickerPage)
        if(response){
          this.sheet.date = new Date(response)
          const user = await this.actionSheetService.openSelect(SelectDataPage, this.usersNames, 'data')
          if(user){
            this.user = this.users.find(u => u.employee.fullName === user)
            if(this.user){
              this.userName = this.user.employee.fullName
              this.sheet.user = this.user._id
            }
          }
      }
    }


    formatedDate(date: string | Date){
      return formatedDateToShow(date).split('ora')[0]
    }

}
