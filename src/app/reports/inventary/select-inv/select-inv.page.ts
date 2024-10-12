import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { InventaryService } from '../inventary.service';
import { Inventary } from '../../../models/inventary.model';
import { formatedDateToShow } from '../../../shared/utils/functions';
import { LogoPagePage } from '../../../shared/logo-page/logo-page.page';
import { ActionSheetService } from '../../../shared/action-sheet.service';
import { DatePickerPage } from '../../../modals/date-picker/date-picker.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { SpinnerPage } from '../../../modals/spinner/spinner.page';

@Component({
  selector: 'app-select-inv',
  templateUrl: './select-inv.page.html',
  styleUrls: ['./select-inv.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LogoPagePage, SpinnerPage]
})
export class SelectInvPage implements OnInit {

  inventaries!: Inventary[]
  isLoading: boolean = false

  constructor(
    private invService: InventaryService,
    private modalCtrl: ModalController,
    @Inject(ActionSheetService) private actService: ActionSheetService,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.getInventaries()
  }

  getInventaries(){
    this.isLoading = true
    this.invService.getAllInventary('all').subscribe(invs => {
      if(invs){
        this.inventaries = invs.reverse()
        this.isLoading = false
      }
    })
  }

  choiseInv(inv: Inventary){
    this.modalCtrl.dismiss(inv)
  }

  editDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

  async createInventary(){
    this.isLoading = true
    const response = await this.actService.openAuth(DatePickerPage)
    if(response){
      this.invService.saveOrUpdateInventary(response.split('T')[0]).subscribe(response => {
        if(response){
          const inventary = response.inv
          if(response.message === 'Inventarul a fost actualizat!'){
            const invIndex = this.inventaries.findIndex(inv => {
              const modifiedInvDate = new Date(inventary.date).setUTCHours(0,0,0,0)
              const oldInvDate = new Date(inv.date).setUTCHours(0,0,0,0)
              return modifiedInvDate === oldInvDate
            })
            if(invIndex !== -1){
              this.inventaries[invIndex] = inventary
              this.isLoading = false
              showToast(this.toast, response.message, 2000)
            }
          } else if(response.message === 'Erorare, nu a fost salavat invetarul scriptic!') {
            showToast(this.toast, response.message, 2000)
            this.isLoading = false
          } else{
            this.inventaries.push(inventary)
            this.isLoading = false
            showToast(this.toast, response.message, 2000)
          }
        }
      })
    } else{
      this.isLoading = false
    }
  }

}
