import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { UsersService } from '../users/users.service';
import { SheduleService } from './shedule.service';
import User from '../../auth/user.model';
import { Shedule } from '../../models/shedule.model';
import { formatedDateToShow, formatPeriod, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { Subscription } from 'rxjs';
import { TogglePage } from './toggle/toggle.page';

@Component({
  selector: 'app-shedule',
  templateUrl: './shedule.page.html',
  styleUrls: ['./shedule.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ShedulePage implements OnInit, OnDestroy {

  menuOpen: boolean = false
  users: any[]  = []
  shedule!: Shedule
  sheduleSub!: Subscription
  period: string = ''
  months: string[] = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];

  isHidden: boolean = false
  lastY: number = 0;

  constructor(
    private usersSrv: UsersService,
    private shedSrv: SheduleService,
    private menuCtrl: MenuController,
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
  ) { }

  ngOnDestroy(): void {
      if(this.sheduleSub){
        this.sheduleSub.unsubscribe()
      }
  }

  open(){
    console.log('open')
  }

  ngOnInit() {
    this.menuChange()
    this.getUsers()
    this.shedSrv.getLastShedule().subscribe()
    this.getLastShedule()
  }

  onScroll(event: any) {
    const currentY = event.detail.scrollTop;

    if (currentY > this.lastY && currentY > 20) {
      // Scrolling down, hide content
      this.isHidden = true;
    } else if(currentY === 0){
      // Scrolling up, show content
      this.isHidden = false;
    }

    this.lastY = currentY;
  }

  getUsers(){
    this.usersSrv.usersSend$.subscribe(response => {
      if(response) {
        const employees = response.filter(user => user.employee.active === true)
        const banUsers = ['Aprovizionare', 'Manager', 'Asociat', 'Administrator', '-', 'Curatenie', 'Project Manager']
        this.users = employees.filter(u => !banUsers.includes(u.employee.position))
       const sortedUsers = this.users.sort((a, b):any => {
          const rolesOrder: any = { Barista: 1, 'Ajutor barman': 2, Casier: 3, Supervizor: 4, Ospatar: 5, ospatar: 5, Bucatar: 7, 'Ajutor bucatar': 8, Aprovizionare: 9, 'Asistent Manager': 6 };
          return rolesOrder[a.employee.position] - rolesOrder[b.employee.position];
        });
        this.users = sortedUsers
    }
  })
}

async selectShedule(){
  const shedule = await this.actSrv.openModal(TogglePage, '', false)
  if(shedule){
    this.shedSrv.selectShedule(shedule)
  }
}


getLastShedule(){
  this.sheduleSub = this.shedSrv.sheduleSend$.subscribe(response => {
    this.shedule = response
    console.log(this.shedule)
  })
}

editPeriod(period: string){
  const split = period.split(' 2025')
  return `${split[0]}${split[1]}`
}

async addOnShedule(day: any, empl: User){

  const options = [
    'Dimineata 7:30 - 15:30',
    'Seara 14:30 - 22:30',
    'Seara 14:00 - 22:00',
    'Full 8:00 - 22:00',
    'Custom',
    'LiBER',
    'Concediu',
    'Medical'
  ]
  const choise = await this.actSrv.entryAlert(options,'radio','Perioadă', 'Alege perioadă', '', '')
  let con = choise === 'Concediu' ? true : false
  let med = choise === 'Medical' ? true : false
  if(choise){
    const dayDate = new Date(day.date)
    const monthNumber = dayDate.getMonth()
    const year = dayDate.getFullYear()
    let start = 0
    let end = 0
    let hours = 0
    if(choise === 'Dimineata 7:30 - 15:30'){
      start = dayDate.setHours(7, 30, 0, 0)
      end = dayDate.setHours(15, 30, 0, 0)
      hours = (end-start) / 1000 / 60 / 60
    }
    if(choise === 'Concediu' || choise === 'Medical'){
      start = dayDate.setHours(7, 30, 0, 0)
      end = dayDate.setHours(15, 30, 0, 0)
      hours = (end-start) / 1000 / 60 / 60
    }
    if(choise === 'Seara 14:30 - 22:30'){
      start = dayDate.setHours(14, 30, 0, 0)
      end = dayDate.setHours(22, 30, 0, 0)
      hours = (end-start) / 1000 / 60 / 60
    }
    if(choise === 'Seara 14:00 - 22:00'){
      start = dayDate.setHours(14, 0, 0, 0)
      end = dayDate.setHours(22, 0, 0, 0)
      hours = (end-start) / 1000 / 60 / 60
    }
    if(choise === 'Full 8:00 - 22:00'){
      start = dayDate.setHours(8, 0, 0, 0)
      end = dayDate.setHours(22, 0, 0, 0)
      hours = (end-start) / 1000 / 60 / 60
    }
    if(choise === 'Custom'){
      const hourss = ['7:00','7:30','8:00','8:30','9:00','9:30','10:00','10:30','11:00', '11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00', '16:30','17:00', '17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00', '23:30']
      const  startHour = await this.actSrv.entryAlert(hourss, 'radio', 'Intrare în tură', 'Alege oră', 'time-alert', '')
      if(startHour){
        const endHour = await this.actSrv.entryAlert(hourss, 'radio', 'Ieșire din tură', 'Alege oră', 'time-alert', '')
        if(endHour){
          const startH = +startHour.split(':')[0]
          const startM = +startHour.split(':')[1]
          const endH = +endHour.split(':')[0]
          const endM = +endHour.split(':')[1]
          start = dayDate.setHours(startH, startM, 0, 0)
          end = dayDate.setHours(endH, endM, 0, 0)
          hours = (end-start) / 1000 / 60 / 60
        }
      }
    }
    const user = {
      workPeriod: {
        start: start,
        end: end,
        hours: hours
      },
      employee: empl._id
    }

    if(choise === 'LiBER'){
      this.shedSrv.deleteEntry(empl._id, day.day, `${this.months[monthNumber]} - ${year}`, day.date).subscribe()
      this.shedSrv.deleteUserWorkEntry(empl._id, dayDate.setHours(0,0,0,0)).subscribe()
    } else {
      const positions = ['Barista', 'Ajutor barman', 'Casier', 'Ospatar', 'Bucatar', 'Ajutor bucatar', 'Supervizor', 'Asistent Manager']
      const choise = await this.actSrv.entryAlert(positions,'radio','Poziție', 'Alege poziția', '', `${empl.employee.position}`)
      if(choise){
        const user = {
          workPeriod: {
            start: start,
            end: end,
            hours: hours,
            position: choise,
            concediu: con,
            medical: med
          },
          employee: empl._id
        }
        const workValue = round((empl.employee.salary.inHeand / empl.employee.salary.norm) * hours)
        const userWorkLog = {
          day: dayDate.setHours(0,0,0,0),
          checkIn: start,
          checkOut: end,
          hours: hours,
          position: choise,
          earnd: workValue,
          concediu: con,
          medical: med
        }
        this.shedSrv.updateUserWorkLog(empl._id, userWorkLog).subscribe()
        this.shedSrv.addEntry(user, day, `${this.months[monthNumber]} - ${year}`, workValue).subscribe()
      }
    }

  }
}

formatDateInHtml(date: any){
  return formatedDateToShow(date)
}

getPosition(users: any[], userId: string){
  const user = users.find(usr => {
    if(usr.employee){
      return usr.employee._id === userId
    } else {
      return
    }

  })
  if(user && user.employee.employee && !user.workPeriod.concediu && !user.workPeriod.medical) {
    return {position: user.workPeriod.position, checkIn: user.checkIn}
  } else if(user &&  user.employee.employee && user.workPeriod.concediu) {
    return {position: 'Concediu', checkIn: false}
  } else if(user && user.employee && user.workPeriod.medical){
    return {position: 'Medical', checkIn: false}
  } else {
    return {position: 'LiBER', checkIn: false}
  }
}

findUser(users: any[], userId: string){
  const user = users.find(usr => {
    if(usr.employee){
      return usr.employee._id === userId
    } else {
      return
    }

  })
    if(user && user.employee.employee) {
      if(user.workPeriod.concediu){
        return 'Concediu'
      } else if(user.workPeriod.medical){
        return 'Medical'
      } else {
        return formatPeriod(user.workPeriod.start, user.workPeriod.end)
      }
    } else {
      return 'LiBER'
    }
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

