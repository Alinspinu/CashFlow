import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Day } from './cash-register.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { CashRegisterService } from './cash-register.service';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { AddEntryPage } from 'src/app/modals/add-entry/add-entry.page';
import User from 'src/app/auth/user.model';
import { getUserFromLocalStorage } from 'src/app/shared/utils/functions';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.page.html',
  styleUrls: ['./cash-register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class CashRegisterPage implements OnInit {

  documents: any[] = [];
  page = 1;

  date!: string
  day!: Day;
  formatedDate!: string
  startDate!: any;
  endDate!: any;
  user!: User
  screenWidth!: number

  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private cashRegService: CashRegisterService,
    private toastCtrl: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth
    this.getUser()
  }

  getUser(){
    getUserFromLocalStorage().then( (user: User | null) => {
      if(user){
        this.user = user
        this.loadDocuments()
      } else {
        this.router.navigateByUrl('/auth')
      }
    })
  }


  showEntryAmount(entry: any){
      if(this.user.employee.access < 4 && entry.typeOf === 'Salariu') {
        return 'xxx'
      } else {
        return entry.amount
      }
  }



  reciveEntry(ev: any){
    const dayIndex = this.documents.findIndex(el => el.date === ev.date)
    this.documents[dayIndex] = ev
  }

  async addEntry(){
    const data = await this.actionSheet.openPayment(AddEntryPage, this.user.locatie)
    if(data){
      const dayIndex = this.documents.findIndex(el => el.date === data.date)
      this.documents[dayIndex] = data
    }
  }


loadDocuments(event?: any) {
  this.cashRegService.getDocuments(this.page, this.user.locatie).subscribe((response) => {
    // Append new documents to the existing list
    this.documents = [...this.documents, ...response.documents];
    if (event) {
      event.target.complete();
    }
    console.log(this.documents)
  });
}

loadMore(event: any) {
  this.page++;
  this.loadDocuments(event);
}


export(){
  if(this.startDate && this.endDate){
    this.cashRegService.exportRegister(this.startDate, this.endDate, this.user.locatie).subscribe(response => {
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

deleteEntry(id: string, index: number, dayIndex: number){
  const dateToCompare = new Date().setUTCHours(0,0,0,0)
  const day = this.documents[dayIndex];
  const dayDate = new Date(day.date).setUTCHours(0,0,0,0)
    this.cashRegService.deleteEntry(id).subscribe(response => {
      showToast(this.toastCtrl, response.message, 3000);
      const entry = day.entry[index];
      day.cashOut = day.cashOut - entry.amount
      day.entry.splice(index, 1);
    })
}

round(num: number){
  return Math.round(num * 100) / 100;
}

}
