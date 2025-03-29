import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
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

menuOpen: boolean = false

totalSalary: number = 0
totalPayd: number = 0
totalBonus: number = 0
totalTesDay: number = 0
totalTes: number = 0
pontSub!: Subscription

period: string = '1-30'
periodMark: boolean = false

hourPeriod: string = '1-30'

isHidden: boolean = false
lastY: number = 0;

  constructor(
    private pontSrv: PontajService,
    private usersSrv: UsersService,
    private menuCtrl: MenuController,
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
  ) { }

  ngOnInit() {
    this.menuChange()
    this.pontSrv.getLastPontaj().subscribe(res => {
      this.pontaj = res
    })
    this.getUsers()
  }

  ngOnDestroy(): void {
      if(this.pontSub){
        this.pontSub.unsubscribe()
      }
  }


  onScroll(event: any) {
    const currentY = event.detail.scrollTop;
    if (currentY > this.lastY && currentY > 20) {
      this.isHidden = true;
    } else if(currentY === 0){
      this.isHidden = false;
    }

    this.lastY = currentY;
  }

  getUsers(){
    this.usersSrv.usersSend$.subscribe(response => {
      if(response) {
        const employees = response.filter(user => user.employee.active === true)
        this.users = employees
        const filtredUsers = this.users.filter(user => {
          const position = user.employee.position
          const positions = ['Asociat', 'Administrator','Project Manager']
          if( user.employee.active === true && !positions.includes(position)){
            return user
          } else {
            return
          }
        })
       const sortedUsers = filtredUsers.sort((a, b):any => {
          const rolesOrder: any = { Barista: 1, 'Ajutor barman': 2, Casier: 3, Supervizor: 4, Ospatar: 5, ospatar: 5, Curatenie: 6, Bucatar: 7, 'Ajutor bucatar': 8, Aprovizionare: 9, 'Asistent Manager': 10 ,Manager: 11 };
          return rolesOrder[a.employee.position] - rolesOrder[b.employee.position];
        });
        this.users = sortedUsers.slice(0,-2)
        this.getPontaj()

    }
  })
}




openPayments(payments: any, userName: string, userID: string){
  const monthPayments = payments.filter((pay: any) => {
    return pay.workMonth === this.monthIndex
  })
  this.actSrv.openModal(PaymentsPage, {name: userName, logs: monthPayments, userID}, false)
}

// hours(workLog: any, name: string, payments: any) {
//   const docToFilter = workLog.filter((doc: any) => {
//     const docDate = new Date(doc.checkIn);
//     return docDate.getMonth() === this.monthIndex
//   })
//   const monthPayments = payments.filter((pay: any) => {
//     return pay.workMonth === this.monthIndex
//   })
//   this.actSrv.openModal(HoursPage, {logs: docToFilter, name: name, payments: monthPayments}, false)
// }


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
    })
  }
}


  getPontaj(){
    this.pontSub = this.pontSrv.pontajSend$.subscribe(response => {
        if(response) {
          this.pontaj = response
          this.period = `1-${this.pontaj.days.length}`
          this.hourPeriod = `1-${this.pontaj.days.length}`
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
    const docToFilter = workLog.filter(doc => {
      const docDate = new Date(doc.checkIn);
      return docDate.getUTCMonth() === this.monthIndex
    })
    const documentsInTargetMonth = docToFilter.filter(doc => {
      const docDate = new Date(doc.checkIn);
      if(this.hourPeriod === `1-${this.pontaj.days.length}`){
        return docDate.getUTCMonth() === this.monthIndex;
      }
      else if(this.hourPeriod === `1-15`){
        return docDate.getUTCMonth() === this.monthIndex && docDate.getDate() <= 15
      }
       else if(this.hourPeriod === `15-${this.pontaj.days.length}`){
        return docDate.getUTCMonth() === this.monthIndex && docDate.getDate() > 15
      } else {
        return
      }
    });
    let hours = 0
    documentsInTargetMonth.forEach(log => {
        hours += log.hours
    })
    return hours
  }

  getIndex(index: number){

  }

  selectHourPeriod(){
    if(this.hourPeriod === `1-${this.pontaj.days.length}`){
      this.hourPeriod = '1-15'
    }
    else if(this.hourPeriod === `1-15`){
      this.hourPeriod = `15-${this.pontaj.days.length}`
    }
    else if(this.hourPeriod === `15-${this.pontaj.days.length}`){
        this.hourPeriod = `1-${this.pontaj.days.length}`
    }
  }


  selectPeriod(){
    if(this.periodMark){
      this.periodMark = false;
      this.period = `1-${this.pontaj.days.length}`
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


}
