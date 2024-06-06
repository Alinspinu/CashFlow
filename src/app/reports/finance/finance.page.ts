import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { convertToDateISOString, formatedDateToShow, getUserFromLocalStorage, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { DatePickerPage } from '../../modals/date-picker/date-picker.page';
import { ReportsService } from '../reports.service';
import User from '../../auth/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { LogoPagePage } from '../../shared/logo-page/logo-page.page';
import { Report } from '../../models/report.model';
import { UsersViewPage } from '../../modals/users-view/users-view.page';
import { DepViewPage } from '../../modals/dep-view/dep-view.page';


@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LogoPagePage]
})
export class FinancePage implements OnInit {

  isLoading: boolean = false

  advance: boolean = false
  startDate!: string
  endDate!: string


  user!: User


  report!: Report

  showRep: boolean = false

  totalConsum: number = 0
  tips: number = 0

  constructor(
   @Inject(ActionSheetService) private actionSheet: ActionSheetService,
   private router: Router,
   private repSrv: ReportsService,
  ) { }

  ngOnInit() {
    // this.createReport()
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

getReport(start: string, end: string){
  this.isLoading = true
  this.repSrv.getReport(start, end).subscribe(response => {
    if(response){
      this.report = response
      this.isLoading = false
      this.showRep = true
      const tipsObj = this.report.paymentMethods.find(p => p.name === "Bacsis" )
      if(tipsObj){
        this.tips = tipsObj.value
      }
      this.totalConsum = round(
        this.report.ingsValue +
        this.report.rentValue +
        this.report.workValue.total +
        this.report.workValue.tax +
        this.report.supliesValue +
        this.report.impairment.total
        )

    }
  })
}


showUsers(users: any, mode: string){
  this.actionSheet.openMobileModal(UsersViewPage, users, mode === 'income' ? true : false)

}
showDep(products: any){
  this.actionSheet.openPayment(DepViewPage, products)

}

createReport(){
  const filter = {
    inreg: true,
    unreg: true,
    goods: true,
    prod: true
  }
  const date = new Date(2024, 5 , 6).toISOString()
  this.repSrv.getHavyOrders(date, date, undefined, environment.LOC, filter, 'report').subscribe()
  // for(let day = 4; day <= 5; day++){
  // }
}




roundInHtml(num: number) {
  return round(num)
}



  async selectDate(){
      const startDate = await this.actionSheet.openAuth(DatePickerPage)
      if(startDate){
        this.startDate = formatedDateToShow(startDate).split('ora')[0]
        const endDate = await this.actionSheet.openAuth(DatePickerPage)
        if(endDate){
          this.endDate = formatedDateToShow(endDate).split('ora')[0]
          this.isLoading = true
          this.getReport(startDate, endDate)

        }
      }


}

}




