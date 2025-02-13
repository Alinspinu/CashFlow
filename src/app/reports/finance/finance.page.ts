import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController} from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { DatePickerPage } from '../../modals/date-picker/date-picker.page';
import { ReportsService } from '../reports.service';
import User from '../../auth/user.model';
import { Router } from '@angular/router';
import { Report, reportUsers } from '../../models/report.model';
import { UsersViewPage } from '../../modals/users-view/users-view.page';
import { DepViewPage } from '../../modals/dep-view/dep-view.page';
import { SpinnerPage } from '../../modals/spinner/spinner.page';
import { AddReportPage } from '../add-report/add-report.page';
import { EntryViewPage } from '../../modals/entry-view/entry-view.page';
import { SelectInvPage } from '../inventary/select-inv/select-inv.page';
import { Inventary, productionReport } from 'src/app/models/inventary.model';
import { emptyInv, emptyProductionReport, emptyReportUsers } from 'src/app/models/empty-models';
import { sortUsers, updateReportValues } from './finance.engine';



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

  totalSpendings: number = 0
  totalRentAndStuff: number = 0

  sup: boolean = true

  menuOpen: boolean = false
  tips: number = 0

  reportUsers: reportUsers = emptyReportUsers()
  productioReport: productionReport = emptyProductionReport()



  constructor(
   @Inject(ActionSheetService) private actionSheet: ActionSheetService,
   @Inject(MenuController) private menuCtrl: MenuController,
   private repSrv: ReportsService,
  ) { }

  ngOnInit() {
    this.menuChange()
    this.getRepDates()
    this.getAllReports()
    this.getuser()

  }

  private async menuChange(){
    const menu = await this.menuCtrl.get('start');
    if (menu) {
      menu.addEventListener('ionDidClose', () => {
        this.menuOpen = false
      });
      menu.addEventListener('ionDidOpen', () => {
           this.menuOpen = true
      });
    }
}


  toggleImpairments(){

  }

  getRepDates(){
    this.repSrv.getReportsDate().subscribe(response => {
      if(response){
        this.start = response.start
        this.end = response.end
      }
    })
  }


  suplies(sub: boolean){
    this.sup = !sub
  }

  getAllReports(){
    this.repSrv.getReports().subscribe(response => {
      if(response){
        this.reports = response.reverse()
        console.log(this.reports)
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
      console.log(response)
      this.report = response
      this.reportUsers = sortUsers(this.report)
      this.productioReport = updateReportValues(this.report, emptyInv(), emptyInv())
      this.isLoading = false
      this.showRep = true
      const tipsObj = this.report.paymentMethods.find(p => p.name === "Bacsis" )
      if(tipsObj){
        this.tips = tipsObj.value
      }
      this.totalSpendings = round(
        this.report.supliesValue.total +
        this.report.impairment.total +
        this.report.constructionsValue.total +
        this.report.gasValue.total +
        this.report.inventarySpendings.total +
        this.report.diverse.total
      )
      this.totalRentAndStuff = round(
        this.report.marketingValue.total +
        this.report.rent.total +
        this.report.utilities.total +
        this.report.serviceValue.total
      )

    }
  })
}




showUsers(users: any, mode: string, total: number){
  const data = {
    users,
    mode,
    total
  }
  this.actionSheet.openMobileModal(UsersViewPage, data, false)
}


showDep(products: any){
  this.actionSheet.openPayment(DepViewPage, products)
}

showEntry(entry: any){
  this.actionSheet.openPayment(EntryViewPage, {total: this.report.diverse.total, entries: entry})
}

showEntries(entry: any){
  this.actionSheet.openModal(EntryViewPage, {total: entry.total, entries: entry.entries}, true)
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

async addInventaries(){
  let firstInv: Inventary = emptyInv()
  let secondInv: Inventary = emptyInv()
  const startInventary = await this.actionSheet.openPayment(SelectInvPage, '')
  if(startInventary){
    firstInv = startInventary
    this.productioReport = updateReportValues(this.report, firstInv, secondInv)
    const secondInventary = await this.actionSheet.openPayment(SelectInvPage, '')
    if(secondInventary){
      secondInv = secondInventary
      this.productioReport = updateReportValues(this.report, firstInv, secondInv)
    }
  }
}




}




