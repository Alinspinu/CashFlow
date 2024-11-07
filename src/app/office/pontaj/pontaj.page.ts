import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PontajService } from './pontaj.service';
import { Pontaj } from '../../models/shedule.model';

import { UsersService } from '../users/users.service';
import { environment } from 'src/environments/environment';
import { round, roundOne } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { TogglePontPage } from './togglePont/toggle-pont.page';
import { Subscription } from 'rxjs';
import { PaymentsPage } from './payments/payments.page';
import { HoursPage } from './hours/hours.page';
import User from '../../auth/user.model';

@Component({
  selector: 'app-pontaj',
  templateUrl: './pontaj.page.html',
  styleUrls: ['./pontaj.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PontajPage implements OnInit, OnDestroy {

pontaj!: Pontaj
users: User[] = []
monhs: string[] = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']
monthIndex!: number

totalSalary: number = 0
totalPayd: number = 0
totalBonus: number = 0
totalTesDay: number = 0
totalTes: number = 0
pontSub!: Subscription

period: string = '1-30'
periodMark: boolean = false

  constructor(
    private pontSrv: PontajService,
    private usersSrv: UsersService,
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
  ) { }

  ngOnInit() {
    this.pontSrv.getLastPontaj().subscribe()
    this.getUsers()
  }

  ngOnDestroy(): void {
      if(this.pontSub){
        this.pontSub.unsubscribe()
      }
  }

  getUsers(){
    this.usersSrv.usersSend$.subscribe(response => {
      if(response) {
        const employees = response.filter(user => user.employee.active === true)
        this.users = employees
       const sortedUsers = this.users.sort((a, b):any => {
          const rolesOrder: any = { Barista: 1, 'Ajutor barman': 2, Casier: 3, Supervizor: 4, Ospatar: 5, ospatar: 5, Bucatar: 6, 'Ajutor bucatar': 7, Aprovizionare: 8, 'Asistent Manager': 9 ,Manager: 10, Asociat: 11, Administrator: 12 };
          return rolesOrder[a.employee.position] - rolesOrder[b.employee.position];
        });
        this.users = sortedUsers.slice(0,-2)
        this.getPontaj()

    }
  })
}




openPayments(payments: any, userName: string){
  const monthPayments = payments.filter((pay: any) => {
    return pay.workMonth === this.monthIndex
  })
  console.log(monthPayments)
  console.log(payments)
  this.actSrv.openModal(PaymentsPage, {name: userName, logs: monthPayments}, false)
}

hours(workLog: any, name: string, payments: any) {
  const docToFilter = workLog.filter((doc: any) => {
    const docDate = new Date(doc.checkIn);
    return docDate.getUTCMonth() === this.monthIndex
  })
  const monthPayments = payments.filter((pay: any) => {
    return pay.workMonth === this.monthIndex
  })
  console.log(monthPayments)
  this.actSrv.openModal(HoursPage, {logs: docToFilter, name: name, payments: monthPayments}, false)
}


async paySalary(user: any){
  const total = this.calcBonus(user.employee.payments) + this.calcIncome(user.employee) - this.calcPayments(user.employee.payments)
  const entry = {
    tip: 'expense',
    date: new Date(),
    description: `Salariu ${user.employee.fullName}`,
    amount: total,
    locatie: environment.LOC,
    typeOf: 'Salariu',
    user: [user._id],
    month: this.monthIndex
  }
  const response = await this.actSrv.deleteAlert(`Plătește salariul lui ${user.employee.fullName} pentru luna ${this.pontaj.month.split('-')[0]}`, `${total} Lei`)
  if(response){
    this.pontSrv.paySalary(entry).subscribe((res: any) => {
      console.log(res)
    })
  }
  console.log(entry)
}


  getPontaj(){
    this.pontSub = this.pontSrv.pontajSend$.subscribe(response => {
        if(response) {
          this.pontaj = response
          this.period = `1 - ${this.pontaj.days.length}`
          this.periodMark = false
          const month = this.pontaj.month.split(' - ')[0]
          this.monthIndex = this.monhs.findIndex(obj => obj === month)
          this.calcTotalStalary()
          this.calcTesTotal()
        }
    })
  }

 async selectPontaj(){
    const pontaj = await this.actSrv.openModal(TogglePontPage, '', false)
    if(pontaj){
      this.pontSrv.selectPontaj(pontaj)
    }
  }



  calcTotalsHours(workLog: any[]){
    const date = new Date().getDate()
    const docToFilter = workLog.filter(doc => {
      const docDate = new Date(doc.checkIn);
      return docDate.getUTCMonth() === this.monthIndex
    })
    const documentsInTargetMonth = docToFilter.filter(doc => {
      const docDate = new Date(doc.checkIn);
      return docDate.getUTCMonth() === this.monthIndex;
    });
    let hours = 0
    documentsInTargetMonth.forEach(log => {
        hours += log.hours
    })
    return hours
  }

  getIndex(index: number){
    console.log(index)
  }


  selectPeriod(){
    if(this.periodMark){
      this.periodMark = false;
      this.period = `1 - ${this.pontaj.days.length}`
      this.calcTotalStalary()
    } else {
      this.periodMark = true;
      this.period = '1-15'
      this.calcTotalStalary()
    }
  }

  calcIncome(empl: any){
    let earnd = 0

    const month = new Date().getUTCMonth()
    if(empl.salary.fix){
      if(!this.periodMark){
        earnd = empl.salary.inHeand
      } else {
        earnd = empl.salary.inHeand / 2
      }
    } else {
      const docToFilter = empl.workLog.filter((doc: any) => {
        const docDate = new Date(doc.checkIn);
        return docDate.getUTCMonth() === this.monthIndex
      })
      const documentsInTargetMonth = docToFilter.filter((doc: any) => {
        const docDate = new Date(doc.checkIn);
        if(!this.periodMark){
          return docDate.getUTCMonth() === this.monthIndex;
        } else {
          return docDate.getDate() <= 15
        }
      });

      documentsInTargetMonth.forEach((log: any) => {
          earnd += log.earnd
      })
    }
    return roundOne(earnd)
  }

  calcPayments(paymentLog: any[]){
    const documentsInTargetMonth = paymentLog.filter(doc => {
      // const docDate = new Date(doc.date);
      return doc.workMonth === this.monthIndex;
    });
    let payments = 0
    documentsInTargetMonth.forEach(log => {
        payments += log.amount
    })
    return round(payments)
  }

  calcBonus(paymentLog: any[]){
    const documentsInTargetMonth = paymentLog.filter(doc => {
      // const docDate = new Date(doc.date);
      // return docDate.getUTCMonth() === this.monthIndex;
      return doc.workMonth === this.monthIndex;
    });
    let payments = 0
    documentsInTargetMonth.forEach(log => {
      if(log.tip === 'Bonus vanzari' || log.tip === 'Bonus excelenta'){
        payments += log.amount
      }
    })
    return roundOne(payments)
  }

  calcTotalStalary(){
    this.totalSalary = 0
    this.totalBonus = 0
    this.totalPayd = 0
    this.users.forEach(user => {
        this.totalSalary += this.calcIncome(user.employee)
        this.totalBonus += this.calcBonus(user.employee.payments)
        this.totalPayd += this.calcPayments(user.employee.payments)
    })
  }

  calcWorkDayValue(day: any, days: number){
    let dayValue = 0
      day.users.forEach((user:any) => {
         dayValue += user.value
      })
      dayValue += this.totalBonus / days
      return roundOne(dayValue)
  }



calcTesTotal(){
  let total = 0
  this.users.forEach(user => {
    if(user.employee.salary.fix) {
        total += user.employee.salary.inHeand
      }
  })
  this.totalTes = total
  this.totalTesDay = roundOne(total / this.pontaj.days.length)
}

  // getPosition(users: any[], userId: string){
  //   const user = users.find(usr => usr.employee === userId)
  //   if(user) {
  //     return user.position
  //   } else {
  //     return '0'
  //   }
  // }

  getPosition(users: any[], userId: string){
    const user = users.find(usr => usr.employee === userId)
    if(user && !user.concediu && !user.medical) {
      return user.position
    } else if(user && user.concediu) {
      return 'Concediu'
    } else if(user && user.medical){
      return 'Medical'
    } else {
      return '0'
    }
  }

  findUser(users: any[], userId: string){
    const user = users.find(usr => usr.employee === userId)
      if(user) {
        return user.hours
      } else {
        return '0'
      }
  }
  roundInHtml(num: number){
    return round(num)
  }




}
