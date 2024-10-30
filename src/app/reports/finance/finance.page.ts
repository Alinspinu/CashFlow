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
import { SelectInvPage } from '../inventary/select-inv/select-inv.page';
import { Inventary, productionReport } from 'src/app/models/inventary.model';
import { emptyInv, emptyProductionReport } from 'src/app/models/empty-models';



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

  productioReport: productionReport = emptyProductionReport()



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




updateValues(report: Report, firstInv: Inventary, secondInv: Inventary):productionReport{
  let prodRep: productionReport = emptyProductionReport()

  report.departaments.forEach(dep => {
    if(dep.name === 'coffee'){
      dep.dep.forEach(dp => {
        if(dp.name === 'marfa'){
          prodRep.iesiri.bar.marfa += dp.total
        } else {
          prodRep.iesiri.bar.prod += dp.total
        }
      })
    }
    if(dep.name === 'bar'){
      dep.dep.forEach(dp => {
        if(dp.name === 'marfa'){
          prodRep.iesiri.bar.marfa += dp.total
        } else {
          prodRep.iesiri.bar.prod += dp.total
        }
      })
    }
    if(dep.name === 'food'){
      dep.dep.forEach(dp => {
        if(dp.name === 'marfa'){
          prodRep.iesiri.buc.marfa += dp.total
        } else {
          prodRep.iesiri.buc.prod += dp.total
        }
      })
    }
    if(dep.name === 'shop'){
      dep.dep.forEach(dp => {
        if(dp.name === 'marfa'){
          prodRep.iesiri.bar.marfa += dp.total
        } else {
          prodRep.iesiri.bar.prod += dp.total
        }
      })
    }
  })

  firstInv.ingredients.forEach(ing => {
    if(ing.gestiune === 'bar'){
      if(ing.dep === 'marfa'){
        if(ing.ing){
          prodRep.intrari.inv.marfaBar += (ing.ing.price * ing.faptic)
        } else {
          console.log(ing)
        }
      } else {
        if(ing.ing){
          prodRep.intrari.inv.prodBar += (ing.ing.price * ing.faptic)
        } else {
          console.log(ing)
        }
      }
    } 
    if(ing.gestiune === 'bucatarie'){
      if(ing.dep === 'marfa'){
        if(ing.ing){
          prodRep.intrari.inv.marfaBuc += (ing.ing.price * ing.faptic)
        } else {
          console.log(ing)
        }
      } else {
        if(ing.ing){
          prodRep.intrari.inv.prodBuc += (ing.ing.price * ing.faptic)
        } else {
          console.log(ing)
        }
      }
    }
  })

  secondInv.ingredients.forEach(ing => {
    if(ing.gestiune === 'bar'){
      if(ing.dep === 'marfa'){
        prodRep.iesiri.inv.marfaBar += (ing.ing.price * ing.faptic)
      } else {
        prodRep.iesiri.inv.prodBar += (ing.ing.price * ing.faptic)
      }
    } 
    if(ing.gestiune === 'bucatarie'){
      if(ing.dep === 'marfa'){
        prodRep.iesiri.inv.marfaBuc += (ing.ing.price * ing.faptic)
      } else {
        prodRep.iesiri.inv.prodBuc += (ing.ing.price * ing.faptic)
      }
    }
  })

  prodRep.intrari.bar.marfa = report.supliesMfBar
  prodRep.intrari.bar.prod = report.supliesProdBar
  prodRep.intrari.buc.marfa = report.supliesMfBuc
  prodRep.intrari.buc.prod = report.supliesProdBuc

  prodRep.dif.marfaBar = round((prodRep.iesiri.inv.marfaBar + prodRep.iesiri.bar.marfa) - (prodRep.intrari.bar.marfa + prodRep.intrari.inv.marfaBar))
  prodRep.dif.prodBar = round((prodRep.iesiri.inv.prodBar + prodRep.iesiri.bar.prod) - (prodRep.intrari.bar.prod + prodRep.intrari.inv.prodBar))
  prodRep.dif.marfaBuc = round((prodRep.iesiri.inv.marfaBuc + prodRep.iesiri.buc.marfa) - (prodRep.intrari.buc.marfa + prodRep.intrari.inv.marfaBuc))
  prodRep.dif.prodBuc = round((prodRep.iesiri.inv.prodBuc + prodRep.iesiri.buc.prod) - (prodRep.intrari.buc.prod + prodRep.intrari.inv.prodBuc))

  prodRep.totals.dif = round(prodRep.dif.marfaBar + prodRep.dif.marfaBuc + prodRep.dif.prodBar + prodRep.dif.prodBuc)
  prodRep.totals.iesiri = round(prodRep.iesiri.bar.marfa + prodRep.iesiri.bar.prod +prodRep.iesiri.buc.marfa + prodRep.iesiri.buc.prod)
  prodRep.totals.intrari = round(prodRep.intrari.bar.marfa + prodRep.intrari.bar.prod + prodRep.intrari.buc.marfa + prodRep.intrari.buc.prod)
  prodRep.totals.firstInv = round(prodRep.intrari.inv.marfaBar + prodRep.intrari.inv.marfaBuc + prodRep.intrari.inv.prodBar + prodRep.intrari.inv.prodBuc)
  prodRep.totals.secondInv = round(prodRep.iesiri.inv.marfaBar + prodRep.iesiri.inv.marfaBuc  + prodRep.iesiri.inv.prodBar + prodRep.iesiri.inv.prodBuc)
  prodRep.totals.dif = round(prodRep.dif.marfaBar + prodRep.dif.marfaBuc + prodRep.dif.prodBar + prodRep.dif.prodBuc)
  return prodRep
}


getReport(start: string, end: string){
  this.isLoading = true
  this.repSrv.getReport(start, end).subscribe(response => {
    if(response){
      this.report = response
      this.productioReport = this.updateValues(this.report, emptyInv(), emptyInv())
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

async addInventaries(){
  let firstInv: Inventary = emptyInv()
  let secondInv: Inventary = emptyInv()
  const startInventary = await this.actionSheet.openPayment(SelectInvPage, '')
  if(startInventary){
    firstInv = startInventary
    this.productioReport = this.updateValues(this.report, firstInv, secondInv)
    const secondInventary = await this.actionSheet.openPayment(SelectInvPage, '')
    if(secondInventary){
      secondInv = secondInventary
      this.productioReport = this.updateValues(this.report, firstInv, secondInv)
    }
  }
}




}




