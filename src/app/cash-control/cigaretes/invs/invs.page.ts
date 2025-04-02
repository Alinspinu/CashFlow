import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CashControlService } from '../../cash-control.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { cigarsInv } from 'src/app/models/inventary.model';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { InvPage } from './inv/inv.page';

@Component({
  selector: 'app-invs',
  templateUrl: './invs.page.html',
  styleUrls: ['./invs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InvsPage implements OnInit {

  constructor(
    private cashService: CashControlService,
    @Inject(ActionSheetService) private actionService: ActionSheetService,
    private modalCtrl: ModalController,
  ) { }

  invs: cigarsInv[] = []

  ngOnInit() {
    this.getInvs()
  }



  close(){
    this.modalCtrl.dismiss(null)
  }


  getInvs(){
    this.cashService.getLastCigInv('all').subscribe({
      next: (response) => {
        this.invs = response
        let name = ''
        let sum = 0
        for(let inv of this.invs){
          sum += inv.products[2].sale
          name = inv.products[2].name
        }
      }
    })
  }

  async showInvs(inv: any){
    const rsp = await this.actionService.openAdd(InvPage, inv, 'medium-two')
  }

  formatDate(date: any) {
    return formatedDateToShow(date)
  }

}
