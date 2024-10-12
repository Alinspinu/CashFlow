import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ReportsService } from '../reports.service';
import { environment } from 'src/environments/environment';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { showToast } from 'src/app/shared/utils/toast-controller';



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
    const filter = {
      inreg: true,
      unreg: true,
      goods: true,
      prod: true
    }
    const oldDate = new Date(this.reports[this.reports.length - 1].day)
    oldDate.setDate(oldDate.getDate() + 1)
    const date = oldDate.toISOString()
    this.isLoading = true
    this.repSrv.getHavyOrders(date, date, undefined, environment.LOC, filter, 'report').subscribe(response => {
      if(response){
        this.reports.push(response)
        this.newReports.push(response)
        this.isLoading = false
      }
    })

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
