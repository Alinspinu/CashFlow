import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Router } from '@angular/router';
import User from 'src/app/auth/user.model';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  styleUrls: ['./ingredients.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IngredientsPage implements OnInit {


  startDay!: string
  endDay!: string

  productSearch!: string
  user!: User



  constructor(
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getuser()
  }


getuser(){
  getUserFromLocalStorage().then(user => {
    if(user) {
      this.user = user
    } else {
      this.router.navigateByUrl('/auth')
    }
  })
}

searchProduct(ev: any){

}

async pickStartDay(){
  const result = await this.actionSrv.openAuth(DatePickerPage)
  if(result){
    this.startDay = formatedDateToShow(result).split('ora')[0]
  }
}

async pickEndDay(){
  const result = await this.actionSrv.openAuth(DatePickerPage)
  if(result){
    this.endDay = formatedDateToShow(result).split('ora')[0]
  }
  this.checkDtes(this.startDay, this.endDay) ? this.search : this.dateErr()
}

checkDtes(start: string, end: string){
  const startDate = new Date(start).getTime()
  const endDate = new Date(end).getTime()
  return startDate <= endDate ? true : false
}

dateErr(){
  showToast(this.toastCtrl, 'DATA DE ÎNCEPUT TREBUIE SĂ FIE MAI NICĂ DECÂT CEA DE SFÂRȘIT!', 3000)
  this.startDay  = ''
  this.endDay = ''
}

search(){

}
}
