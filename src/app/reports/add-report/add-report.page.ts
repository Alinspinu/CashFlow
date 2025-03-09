import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ReportsService } from '../reports.service';
import { environment } from 'src/environments/environment';
import { formatedDateToShow, sortByDate } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';



@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.page.html',
  styleUrls: ['./add-report.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddReportPage implements OnInit {

  reports: any[] = []
  newReports: any[] = []

  isLoading: boolean = false


  filter: any = {
    inreg: true,
    unreg: true,
    goods: true,
    prod: true
  }

  constructor(
    private modalCtrl: ModalController,
    private navPar: NavParams,
    private repSrv: ReportsService,
    private toastCtrl: ToastController,
    @Inject(ActionSheetService) private actSheet: ActionSheetService
  ) { }

  ngOnInit() {
    this.reports = this.navPar.get('options')
  }

  async deleteReport(report: any){
    const message = `Ești sigur că vrei să ștergi raportul din ${this.formatDate(report.day)}?`
    const title = `ȘTERGE RAPORT`
    const response = await this.actSheet.deleteAlert(message, title)
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


  addReport(){
    const oldDate = new Date(this.reports[this.reports.length - 1].day)
    oldDate.setDate(oldDate.getDate() + 1)
    const date = oldDate.toISOString()
    this.isLoading = true
    this.repSrv.getHavyOrders(date, date, undefined, environment.LOC, this.filter, 'report').subscribe(response => {
      if(response){
        this.reports.push(response)
        this.newReports.push(response)
        this.isLoading = false
      }
    })

  }

 async deleteReports(){
    const startDate = await this.actSheet.openPayment(DatePickerPage, 'DATA DE ÎNCEPUT')
    if(startDate){
      const endDate = await this.actSheet.openPayment(DatePickerPage, 'DATA DE SFÂRȘIT')
      if(endDate){
        const date = new Date(startDate)
        date.setDate(date.getDate() -1)
        this.repSrv.deleteReports(date.toISOString(), endDate).subscribe({
          next: (response) => {
            showToast(this.toastCtrl, response.message, 2000)
            this.close()
          },
          error: (error) => {
            showToast(this.toastCtrl, error.message, 2000)
            console.log(error)
          }
        })
      }
    }
  }

 async addReportOnDate(){
    const date = await this.actSheet.openPayment(DatePickerPage, '')
    if(date){
      this.isLoading = true
      this.repSrv.getHavyOrders(date, date, undefined, environment.LOC, this.filter, 'report').subscribe(response => {
        if(response){
          this.reports.push(response)
          this.reports = sortByDate(this.reports, true)
          this.newReports.push(response)
          this.isLoading = false
        }
      })
    }
  }


  close(){
    this.modalCtrl.dismiss(null)
  }


  update(){
    this.modalCtrl.dismiss(this.newReports)
  }

  formatDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
