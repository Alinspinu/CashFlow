import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { convertToDateISOString, formatedDateToShow, getUserFromLocalStorage, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { DatePickerPage } from '../../modals/date-picker/date-picker.page';
import { ReportsService } from '../reports.service';
import User from '../../auth/user.model';
import { Router } from '@angular/router';
import { PontajService } from 'src/app/office/pontaj/pontaj.service';
import { environment } from '../../../environments/environment.prod';
import { UsersService } from '../../office/users/users.service';
import { Subscription } from 'rxjs';
import { IngredientService } from '../../office/ingredient/ingredient.service';
import { LogoPagePage } from '../../shared/logo-page/logo-page.page';


@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LogoPagePage]
})
export class FinancePage implements OnInit, OnDestroy {

  isLoading: boolean = false

  ingSub!: Subscription

  advance: boolean = false
  startDate!: string
  endDate!: string
  // startDate: string | undefined = formatedDateToShow(new Date(Date.now() - 24 * 60 * 60 * 1000)).split('ora')[0]
  // endDate: string | undefined = formatedDateToShow(new Date(Date.now() - 24 * 60 * 60 * 1000)).split('ora')[0]
  today: string = this.formatDate(new Date(Date.now()).toString()).split('ora')[0]
  day: boolean = true

  dayRent: number = round(60000 / this.getDaysInMonthFromDate(new Date(Date.now())))
  rent: number = this.dayRent

  pontaj!: any

  consDayValue: number = 0
  consValue: number = 0

  consIngs: any[] = []
  selectedDays: any[] = []
  dep: number = 0

  delProducts: any[] = []

  totalBonus: number = 0
  totalWorkDays: number = 0

  tesDay: number = 0
  user!: User
  users: any[] = []

  dbProducts!: any
  dbIngs!: any

  monthIndex!: number
  totalProducta: number = 0
  totalIngs: number = 0
  situation: number = 0

  report!: any

  constructor(
   @Inject(ActionSheetService) private actionSheet: ActionSheetService,
   private reportsSrv: ReportsService,
   private pontSrv: PontajService,
   private router: Router,
   private usersSrv: UsersService,
   private ingSrv: IngredientService,
   private repSrv: ReportsService,
  ) { }

  ngOnInit() {
    this.getuser()
  }

  ngOnDestroy(): void {
      if(this.ingSub){
        this.ingSub.unsubscribe()
      }
  }


  getuser(){
    getUserFromLocalStorage().then(user => {
      if(user) {
        this.user = user
        // this.getProducts()

    } else {
      this.router.navigateByUrl('/auth')
    }
  })
}

getReport(start: string, end: string){
  this.repSrv.getReport(start, end).subscribe(response => {
    if(response){
      this.report = response
      console.log(this.report)
    }
  })
}


getODep(){
  this.repSrv.getDep(convertToDateISOString(this.startDate), convertToDateISOString(this.endDate)).subscribe(response => {
    console.log(response)
    if(response || response === 0){
      this.dep = round(response)
      this.situation = this.totalProducta - this.totalIngs - this.totalWorkDays - this.rent - this.consValue - this.dep
      this.isLoading = false
    }
  })
}


  calcConsumabilsValue(){
    let total = 0
    this.consIngs = []
    this.ingSub = this.ingSrv.getIngsConsumabils().subscribe(ings => {
      if(ings && this.startDate){
        const monthDays = this.getDaysInMonthFromDate(new Date(convertToDateISOString(this.startDate)))
        const currentMonth = new Date(Date.now()).getUTCMonth()
        const currentDay = new Date(Date.now()).getUTCDate()
        const month =  new Date(convertToDateISOString(this.startDate)).getUTCMonth()
        ings.forEach(ing => {
          ing.uploadLog.forEach(obj => {
            const uploadMonth = new Date(obj.date).getUTCMonth()
            if(uploadMonth === month) {
              const ingToPush = {
                name: ing.name,
                price: ing.tvaPrice,
                quantity: obj.qty,
                total: ing.tvaPrice * obj.qty
              }
              const existingIng = this.consIngs.find(obj => obj.name === ing.name)
              if(existingIng){
                existingIng.quantity += ingToPush.quantity
                existingIng.total += ingToPush.total
              } else {
                this.consIngs.push(ingToPush)
              }
            }
          })
        })
        this.consIngs.forEach(ing => {
          total += ing.total
        })
        if(currentMonth > month){
          this.consDayValue = round(total / monthDays)
        } else {
          this.consDayValue = round(total / currentDay)
        }
      }
    })
    this.getLastPontaj()
  }


  getProducts(){
    this.resetValues()
    const filter = {
      inreg: true,
      unreg: true,
      goods: true,
      prod: true
    }


    let date = new Date(2024, 5, 3).toISOString(); // Month is 0-indexed, so 4 represents May
    this.reportsSrv.getHavyOrders(date, date, undefined, this.user.locatie, filter, 'report').subscribe(response => {
     if(response){
      //  this.calcProductsTotal(response.result.allProd)
      //  this.calcIngredientsTotal(response.ingredients)
      //  this.calcConsumabilsValue()
     }
    // for (let day = 30; day <= 32; day++) {
    // }
      })


  }

  getLastPontaj(){
    this.pontSrv.getPontByMonth('Mai - 2024').subscribe(response => {
        if(response) {
          this.pontaj = response
          if(this.startDate && this.endDate){
            const start =  new Date(convertToDateISOString(this.startDate)).setHours(0,0,0,0)
            const end = new Date(convertToDateISOString(this.endDate)).setHours(0,0,0,0)
            this.selectedDays = this.pontaj.days.filter((day: any) => {
                const dayDate = new Date(day.date).setHours(0,0,0,0)
                return dayDate >= start && dayDate <= end
            })
          }
          this.rent = this.dayRent * this.selectedDays.length
          this.consValue = this.consDayValue * this.selectedDays.length
          this.selectedDays.forEach((day: any) => {
            day.users.forEach((user: any) => {
              this.totalWorkDays += user.value
            })
          })
          this.getUsers()
        }
    })
  }

  getUsers(){
    this.usersSrv.getUsers('employees', '', environment.LOC).subscribe(response => {
      if(response) {
        let total = 0
        this.users = response
        this.users.forEach(user => {
          this.selectedDays.forEach(day => {
            user.employee.payments.forEach((pay: any) => {
              const paymentDate = new Date(pay.date).setHours(0,0,0,0);
              const dayDate = new Date(day.date).setHours(0,0,0,0)
              if(paymentDate === dayDate && pay.tip === "Bonus vanzari"){
                this.totalBonus += pay.amount
              }
            })
          })
          if(user.employee.salary.fix) {
            total += user.employee.salary.inHeand
          }
        })
        this.tesDay = round(total / this.pontaj.days.length)
        this.totalWorkDays += (this.tesDay * this.selectedDays.length)
        this.getODep()
    }
  })
}

  calcProductsTotal(products: any[]){
    let totalProducts = 0
    this.totalProducta = 0
    products.forEach(product => {
      const productValue = round(product.quantity * product.price - product.discount)
      totalProducts += productValue
    })
    this.totalProducta = round(totalProducts)
  }

  calcIngredientsTotal(ingredients: any []){
    let totalIngredients = 0
    this.totalIngs = 0
    ingredients.forEach(ing => {
      if(ing.ing && ing.ing.tvaPrice && ing.qty){
        const ingValue = round(ing.ing.tvaPrice *ing.qty)
        totalIngredients += ingValue
      } else {
      }
    })
    this.totalIngs = round(totalIngredients)
  }

  calcTesTotal(){
    let total = 0
    this.users.forEach(user => {
      if(user.employee.salary.fix) {
          total += user.employee.salary.inHeand
        }
    })
      this.tesDay = round(total / this.pontaj.days.length)

  }



  async selectDate(){
      const startDate = await this.actionSheet.openAuth(DatePickerPage)
      if(startDate){
        this.startDate = formatedDateToShow(startDate).split('ora')[0]
        const endDate = await this.actionSheet.openAuth(DatePickerPage)
        if(endDate){
          this.endDate = formatedDateToShow(endDate).split('ora')[0]
          this.day = false
          this.isLoading = true
          this.rent = this.dayRent * (new Date(endDate).getDate() - new Date(startDate).getDate() + 1)
          this.getReport(startDate, endDate)

        }
      }
    }

    formatDate(date: string | undefined){
      return formatedDateToShow(date).split(' ora')[0]
    }

    getDaysInMonthFromDate(date: any) {
      const year = date.getFullYear();
      const month = date.getMonth();
      return new Date(year, month + 1, 0).getDate();
    }

    roundInHtml(num: number) {
      return round(num)
    }


    resetValues(){
      this.totalWorkDays = 0
      this.totalBonus = 0
      this.totalIngs = 0
      this.dep = 0
      this.tesDay = 0
      this.consDayValue = 0
      this.consValue = 0
      this.situation = 0
    }


}
