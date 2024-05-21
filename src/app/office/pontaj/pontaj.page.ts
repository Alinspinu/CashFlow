import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PontajService } from './pontaj.service';
import { Pontaj } from '../../models/shedule.model';

import { UsersService } from '../users/users.service';
import { environment } from 'src/environments/environment';
import User from '../../auth/user.model';
import { round, roundOne } from '../../shared/utils/functions';

@Component({
  selector: 'app-pontaj',
  templateUrl: './pontaj.page.html',
  styleUrls: ['./pontaj.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PontajPage implements OnInit {

pontaj!: Pontaj
users: any[] = []
monhs: string[] = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']
monthIndex!: number

totalSalary: number = 0
totalPayd: number = 0
totalBonus: number = 0
totalTesDay: number = 0
totalTes: number = 0

  constructor(
    private pontSrv: PontajService,
    private usersSrv: UsersService
  ) { }

  ngOnInit() {
    this.getUsers()
  }



  getUsers(){
    this.usersSrv.getUsers('employees', '', environment.LOC).subscribe(response => {
      if(response) {
        this.users = response
       const sortedUsers = this.users.sort((a, b):any => {
          const rolesOrder: any = { Barista: 1, 'Ajutor barman': 2, Casier: 3, Ospatar: 4, ospatar: 4, Bucatar: 5, 'Ajutor bucatar': 6, 'Asistent Manager': 7, Manager: 8, Designer: 9, Asociat: 10, Administrator: 11 };
          return rolesOrder[a.employee.position] - rolesOrder[b.employee.position];
        });
        this.users = sortedUsers.slice(0,-2)
        this.getLastPontaj()

    }
  })
}


  getLastPontaj(){
    this.pontSrv.getLastPontaj().subscribe(response => {
        if(response) {
          this.pontaj = response
          const month = this.pontaj.month.split(' - ')[0]
          this.monthIndex = this.monhs.findIndex(obj => obj === month)
          this.calcTotalStalary()
          this.calcTesTotal()
        }
    })
  }

  selectPontaj(){

  }

  calcTotalsHours(workLog: any[]){
    const date = new Date(Date.now()).getDate()
    const documentsInTargetMonth = workLog.filter(doc => {
      const docDate = new Date(doc.checkIn);
      if(date > 20) {
        return docDate.getUTCMonth() === this.monthIndex;
      } else {
        return docDate.getDate() <= 15
      }
    });
    let hours = 0
    documentsInTargetMonth.forEach(log => {
        hours += log.hours
    })
    return hours
  }

  calcIncome(empl: any){
    let earnd = 0
    const date = new Date(Date.now()).getDate()
    if(empl.salary.fix){
      if(date > 20){
        earnd = empl.salary.inHeand
      } else {
        earnd = empl.salary.inHeand / 2
      }
    } else {
      const documentsInTargetMonth = empl.workLog.filter((doc: any) => {
        const docDate = new Date(doc.checkIn);
        if(date < 20){
          return docDate.getDate() < 16
        } else {
          return docDate.getUTCMonth() === this.monthIndex;
        }
      });

      documentsInTargetMonth.forEach((log: any) => {
          earnd += log.earnd
      })
    }
    return round(earnd)
  }

  calcPayments(paymentLog: any[]){
    const documentsInTargetMonth = paymentLog.filter(doc => {
      const docDate = new Date(doc.date);
      return docDate.getUTCMonth() === this.monthIndex;
    });
    let payments = 0
    documentsInTargetMonth.forEach(log => {
        payments += log.amount
    })
    return round(payments)
  }

  calcBonus(paymentLog: any[]){
    const documentsInTargetMonth = paymentLog.filter(doc => {
      const docDate = new Date(doc.date);
      return docDate.getUTCMonth() === this.monthIndex;
    });
    let payments = 0
    documentsInTargetMonth.forEach(log => {
      if(log.tip === 'Bonus vanzari' || log.tip === 'Bonus excelenta'){
        payments += log.amount
      }
    })
    return round(payments)
  }

  calcTotalStalary(){
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
    if(user) {
      return user.position
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
