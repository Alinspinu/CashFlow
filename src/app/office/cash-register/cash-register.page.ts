import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule, ToastController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Day } from './cash-register.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { CashRegisterService } from './cash-register.service';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { AddEntryPage } from 'src/app/modals/add-entry/add-entry.page';
import User from 'src/app/auth/user.model';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.page.html',
  styleUrls: ['./cash-register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class CashRegisterPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content!: IonContent;

  documents: any[] = [];
  page = 1;

  date!: string
  day!: Day;
  formatedDate!: string
  startDate!: any;
  endDate!: any;
  user!: User
  menuOpen: boolean = false

  pointId: string = ''


  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    @Inject(MenuController) private menuCtrl: MenuController,
    private cashRegService: CashRegisterService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.loadDocuments()
    this.menuChange()
  
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


  calcDayPayments(day: Day){
    let total = 0
    for(let entry of day.entry){
      if(entry.tip === 'expense'){
        total -= entry.amount
      }
    }
    return this.round(total)
  }

  calcDayIncome(day: Day){
    let total = 0
    for(let entry of day.entry){
      if(entry.tip === 'income'){
        total += entry.amount
      }
    }
    return this.round(total + day.cashIn)
  }

  deleteDay(day: Day) {
    if(day.entry.length){
       showToast(this.toastCtrl, 'Trebuie să ștergi toate intrările din ziua pentru a pute șterge ziua', 3000)
    } else {
      this.cashRegService.deleteDay(day._id).subscribe({
        next: (message) => {
          // const index = this.documents.findIndex(d => d._id === day._id)
          // if(index !== -1) this.documents.splice(index, 1)
          showToast(this.toastCtrl, message.message, 3000)
        },
        error: (error) => {
          console.log(error)
          showToast(this.toastCtrl, error.message, 4000)
        }
      })
    }
  }





  reciveEntry(ev: any){
    const dayIndex = this.documents.findIndex(el => el.date === ev.date)
    this.documents[dayIndex] = ev
  }

  async addEntry(){
    const data = await this.actionSheet.openAdd(AddEntryPage, 'register', 'small-two')
    if(data && data.entry){
      this.cashRegService.addEntry(data.entry).subscribe()
    }
  }


loadDocuments() {
  this.cashRegService.entriesSend$.subscribe((response) => {
    this.documents = response
    setTimeout(() => {
     this.content.scrollToBottom(600)
    }, 300);
  });
}



export(){
  if(this.startDate && this.endDate){
    this.cashRegService.exportRegister(this.startDate, this.endDate, this.pointId).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Registru de casa perioada ${this.formatDate(this.startDate)}--${this.formatDate(this.endDate)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }
}


async openDateModal(mode: string){
  const response = await this.actionSheet.openAuth(DatePickerPage)
  if(response && mode === 'start'){
    this.startDate = response
  }
  if(response && mode === 'end'){
    this.endDate = response
  }
}



formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString();
  return `${day}.${month}.${year}`;
}

async deleteEntry(id: string, index: number, dayIndex: number){
  const response = await this.actionSheet.deleteAlert('Ești sigur că vrei să ștergi intrarea?', "Șterge intrarea")
  if(response){
    const day = this.documents[dayIndex];
      this.cashRegService.deleteEntry(id, index, dayIndex).subscribe(response => {
        showToast(this.toastCtrl, response.message, 3000);
        const entry = day.entry[index];
        day.cashOut = day.cashOut - entry.amount
        day.entry.splice(index, 1);
      })
  }
}

round(num: number){
  return Math.round(num * 100) / 100;
}



}
