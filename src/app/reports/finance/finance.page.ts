import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { DatePickerPage } from '../../modals/date-picker/date-picker.page';
import { ReportsService } from '../reports.service';
import User from '../../auth/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { Report } from '../../models/report.model';
import { UsersViewPage } from '../../modals/users-view/users-view.page';
import { DepViewPage } from '../../modals/dep-view/dep-view.page';
import { SpinnerPage } from '../../modals/spinner/spinner.page';
import { AddReportPage } from '../add-report/add-report.page';
import { EntryViewPage } from '../../modals/entry-view/entry-view.page';


@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerPage]
})
export class FinancePage implements OnInit {

  isLoading: boolean = false

  advance: boolean = false
  startDate!: string
  endDate!: string


  reports: any[] = []
  user!: User


  report!: Report

  showRep: boolean = false

  start!: string;
  end!: string;

  totalConsum: number = 0
  tips: number = 0

  constructor(
   @Inject(ActionSheetService) private actionSheet: ActionSheetService,
   private router: Router,
   private repSrv: ReportsService,

  ) { }

  ngOnInit() {
    this.getRepDates()
    this.getAllReports()
    this.getuser()
  }

  getRepDates(){
    this.repSrv.getReportsDate().subscribe(response => {
      if(response){
        this.start = response.start
        this.end = response.end
      }
    })
  }


  getAllReports(){
    this.repSrv.getReports().subscribe(response => {
      if(response){
        this.reports = response.reverse()
      }
    })
  }


  getuser(){
    getUserFromLocalStorage().then(user => {
      if(user) {
        this.user = user
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
        this.report.rent +
        this.report.workValue.total +
        this.report.workValue.tax +
        this.report.supliesValue +
        this.report.impairment.total +
        this.report.utilities +
        this.report.constructionsValue +
        this.report.gasValue +
        this.report.inventarySpendings +
        this.report.marketingValue +
        this.report.diverse.total
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

showEntry(entry: any){
  this.actionSheet.openPayment(EntryViewPage, {total: this.report.diverse.total, entries: entry})
}


roundInHtml(num: number) {
  return round(num)
}



async createReport(){
  const response = await this.actionSheet.openPayment(AddReportPage, this.reports)
  if(response){
    this.reports = [...this.reports, ...response]
    this.end = this.reports[this.reports.length -1].day
  }
}



  async selectDate(){
      const startDate = await this.actionSheet.openPayment(DatePickerPage, {min: this.start, max: this.end, mode: 'ALEGE ZIUA DE ÎNCEPUT'})
      if(startDate){
        this.startDate = formatedDateToShow(startDate).split('ora')[0]
        const endDate = await this.actionSheet.openPayment(DatePickerPage, {min: this.start, max: this.end, mode: "ALEGE ZIUA DE SFÂRȘIT"})
        if(endDate){
          this.endDate = formatedDateToShow(endDate).split('ora')[0]
          this.isLoading = true
          this.getReport(startDate, endDate)

        }
      }


}

}




