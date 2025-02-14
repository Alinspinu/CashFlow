import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ToastController} from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { DatePickerPage } from '../../modals/date-picker/date-picker.page';
import { ReportsService } from '../reports.service';
import User from '../../auth/user.model';
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
import { environment } from 'src/environments/environment';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { IngsPage } from './ings/ings.page';
import { EmplPage } from './empl/empl.page';
import { SpendPage } from './spend/spend.page';



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

  ingredientsValue: string = 'recipes'

  constructor(
   @Inject(ActionSheetService) private actionSheet: ActionSheetService,
   @Inject(MenuController) private menuCtrl: MenuController,
   private repSrv: ReportsService,
   private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.menuChange()
    this.getLastReport()
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



  saveReport(){
      if(this.report){
        this.report.salePoint = environment.POINT
        this.repSrv.saveReport(this.report).subscribe({
          next: (response) => {
            this.report = response.report
            this.updateRaport(this.report)
            showToast(this.toastCtrl, response.message, 3000)
          },
          error: (error) => {
            console.log(error)
            showToast(this.toastCtrl, error.message, 4000)
          }
        })
      }
  }

  getLastReport(){
    this.repSrv.getLastReport().subscribe({
      next: (response) => {
        if(response){
          this.report = response
          this.updateRaport(this.report)
        }
      },
      error: (error) => {
        console.log(error)
        showToast(this.toastCtrl, error.message, 4000)
      }
    })
  }

  async deleteReport(report: any){
    const message = `Ești sigur că vrei să ștergi raportul din ${report.period}?`
    const title = `ȘTERGE RAPORT`
    const response = await this.actionSheet.deleteAlert(message, title)
    if(response){
      this.repSrv.deleteReport(report._id).subscribe(response => {
        if(response){
        const index = this.reports.findIndex(rep => rep._id === report._id)
        this.reports.splice(index, 1)
        showToast(this.toastCtrl, response.message, 200)
        }
      })
    }
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


async openDetails(details: string){
  if(details === 'ings') await this.actionSheet.openAdd(IngsPage, this.productioReport, 'medium-one')
  if(details === 'imp') await this.actionSheet.openAdd(DepViewPage, this.report.impairment.products, 'small-two')
  if(details === 'employee') await this.actionSheet.openAdd(EmplPage, this.reportUsers, 'medium-two')
  if(details === 'spendings') await this.actionSheet.openAdd(SpendPage, {report: this.report, totalSpendings: this.totalSpendings + this.totalRentAndStuff}, 'small')
}


getReport(start: string, end: string){
  this.isLoading = true
  this.repSrv.getReport(start, end).subscribe(response => {
    if(response){
      this.report = response
      this.updateRaport(this.report)
    }
  })
}

updateRaport(report: Report){
  this.reportUsers = sortUsers(report)
  this.productioReport = updateReportValues(report, emptyInv(), emptyInv())
  this.isLoading = false
  this.showRep = true
  const tipsObj = report.paymentMethods.find(p => p.name === "Bacsis" )
  if(tipsObj){
    this.tips = tipsObj.value
  }
  this.totalSpendings = round(
    report.supliesValue.total +
    report.constructionsValue.total +
    report.gasValue.total +
    report.inventarySpendings.total +
    report.diverse.total
  )
  this.totalRentAndStuff = round(
    report.marketingValue.total +
    report.rent.total +
    report.utilities.total +
    report.serviceValue.total
  )
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



formatDate(date: string){
  return formatedDateToShow(date).split('ora')[0]
}


}




